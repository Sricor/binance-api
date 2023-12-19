import type {
  BinanceHttpClient as BnClient,
  HttpClient as Client,
  RequestParams,
} from "./types.ts";
import { Error, Result } from "@resources/common.ts";

export interface HttpClientConfig {
  baseUrl: string;
  // proxy: string;
}

export class HttpClient implements Client {
  #baseUrl: string;

  set baseUrl(url: string) {
    this.#baseUrl = url;
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  constructor(config: HttpClientConfig) {
    this.#baseUrl = config.baseUrl;
  }

  async get(req: RequestParams) {
    return await this.#request("GET", req);
  }

  public async post(req: RequestParams) {
    return await this.#request("POST", req);
  }

  protected async toJson<T>(resp: Response) {
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

  #request = async (method: string, req: RequestParams) => {
    const path = req.params ? req.path + this.#formatUrlParams(req.params) : req.path;
    const url = `${this.#baseUrl}${path}`;
    try {
      const response = await fetch(url, {
        method: method,
        headers: req.headers,
        body: req.body,
      });
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
  };

  #formatUrlParams(params: { [key: string]: string }) {
    const queryString = Object.entries(params)
      .filter(([_key, value]) => typeof value === "string" && value !== "")
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return queryString ? `?${queryString}` : "";
  }
}

export class BinanceHttpClient extends HttpClient implements BnClient {
  async process<T>(resp: Result<Response, Error>): Promise<Result<T, Error>> {
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
