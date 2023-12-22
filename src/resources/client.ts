import type { BinanceHttpClient as BnClient, HttpClient as Client } from "./types.ts";
import { DigestMessage, Error, Result } from "./common.ts";

export interface HttpClientConfig {
  baseUrl: string;
  // proxy: string;
}

export class HttpClient implements Client {
  baseUrl: string;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
  }

  public async request(path: string, init?: RequestInit) {
    const url = new URL(path, this.baseUrl);
    try {
      const response = await fetch(url, init);
      return new Result<Response, Error>({
        ok: true,
        value: response,
      });
    } catch (error) {
      return new Result<Response, Error>({
        ok: false,
        error: await Error.createRequestErr(`${error}`),
      });
    }
  }

  public urlEncode(params: Record<string, string | number | boolean>) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return `?${queryString}`;
  }

  public async toJson<T>(resp: Response) {
    try {
      return new Result<T, Error>({
        ok: true,
        value: await resp.json(),
      });
    } catch (error) {
      return new Result<T, Error>({
        ok: false,
        error: await Error.create(`Format Json Error: ${error}`),
      });
    }
  }
}

export class BinanceHttpClient extends HttpClient implements BnClient {
  #apiKey?: string;
  #secretKey?: string;

  set apiKey(key: string) {
    this.#apiKey = key;
  }

  set secretKey(key: string) {
    this.#secretKey = key;
  }

  public async request(path: string, init?: RequestInit, apit?: { key: boolean; sign: boolean }) {
    if (!init) init = {};
    init.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      ...init.headers,
    };

    if (apit?.sign) {
      if (!this.#secretKey) {
        return new Result<Response, Error>({
          ok: false,
          error: await Error.create(`Not Provided Secret Key.`),
        });
      }
      const index = path.indexOf("?");
      path = `${path}&signature=${await DigestMessage.hmacSha256(
        this.#secretKey,
        index !== -1 ? path.substring(index + 1) : "",
      )}`;
    }

    if (apit?.key) {
      if (!this.#apiKey) {
        return new Result<Response, Error>({
          ok: false,
          error: await Error.create(`Not Provided Api Key.`),
        });
      }
      init.headers = {
        "X-MBX-APIKEY": this.#apiKey,
        ...init.headers,
      };
    }

    return super.request(path, init);
  }

  public async process<T>(resp: Result<Response, Error>): Promise<Result<T, Error>> {
    if (!resp.ok) {
      return new Result<T, Error>({
        ok: false,
        error: resp.error,
      });
    }

    const response = resp.value as Response;

    if (response.ok) {
      const json = await this.toJson<T>(response);
      if (json.ok) {
        return new Result<T, Error>({
          ok: true,
          value: json.value,
        });
      }
    }

    return new Result<T, Error>({
      ok: false,
      error: await Error.createBinanceApiErr(response),
    });
  }
}
