import type { Error as Err, ErrorType, Result as Res } from "./types.ts";

export class Result<T, E extends Err> implements Res<T, E> {
  readonly ok: boolean;
  readonly value?: T;
  readonly error?: E;

  constructor(result: { ok: boolean; value?: T; error?: E }) {
    this.ok = result.ok;
    this.value = result.value;
    this.error = result.error;
  }
}

export class Error implements Err {
  readonly name: string;
  readonly message: string;
  readonly type: ErrorType;

  readonly statusCode?: number;
  readonly binanceApiErr?: Err["binanceApiErr"];

  private constructor(err: Err) {
    this.name = err.name;
    this.statusCode = err.statusCode;
    this.message = err.message;
    this.binanceApiErr = err.binanceApiErr;
    this.type = err.type;
  }

  // deno-lint-ignore require-await
  static async create(message?: string): Promise<Error> {
    const err = new Error({
      type: "Error",
      name: "Error",
      message: message || "",
    });
    return err;
  }

  // deno-lint-ignore require-await
  static async createRequestErr(message?: string): Promise<Error> {
    const err = new Error({
      type: "HttpRequestError",
      name: "HTTP Request Error",
      message: message || ``,
    });
    return err;
  }

  static async createBinanceApiErr(resp: Response, message?: string): Promise<Error> {
    let binanceApiErr;
    try {
      binanceApiErr = await resp.json();
    } catch {
      binanceApiErr = undefined;
    }

    const err = new Error({
      type: "BinanceHttpApiError",
      name: "Binance API Request Error",
      message: message || "",
      binanceApiErr: binanceApiErr,
      statusCode: resp.status,
    });
    return err;
  }
}

export class DigestMessage {
  static async hmacSha256(key: string, message: string) {
    const keyArr = toUnit8Array(String(key));
    const dataArr = toUnit8Array(String(message));

    const hashArray = await crypto.subtle.importKey(
      "raw",
      keyArr,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign", "verify"],
    )
      .then((key) => crypto.subtle.sign("HMAC", key, dataArr))
      .then((signature) => new Uint8Array(signature));
    return toHexString(hashArray);
  }
}

function toUnit8Array(data: string) {
  return new TextEncoder().encode(String(data));
}

function toHexString(data: ArrayBuffer) {
  const u8Arr = Array.from(new Uint8Array(data));
  const hex = u8Arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
}
