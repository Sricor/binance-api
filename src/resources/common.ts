import { Error as Err, ErrorType, Result as Res } from "@resources/types.ts";

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
      type: ErrorType.Err,
      name: "Error",
      message: message || "",
    });
    return err;
  }

  // deno-lint-ignore require-await
  static async createRequestErr(message?: string): Promise<Error> {
    const err = new Error({
      type: ErrorType.RequestErr,
      name: "Request Error",
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
      type: ErrorType.BinanceHttpApiErr,
      name: "Binance API Request Error",
      message: message || "",
      binanceApiErr: binanceApiErr,
      statusCode: resp.status,
    });
    return err;
  }
}
