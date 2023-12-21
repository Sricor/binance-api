//deno-fmt-ignore
export const enum ErrorType {
  Err               = "Error",
  RequestErr        = "RequestError",
  BinanceHttpApiErr = "BinanceHttpApiError",
}

export interface Error {
  readonly type: ErrorType;
  readonly name: string;
  readonly message: string;
  readonly statusCode?: number;
  readonly binanceApiErr?: Promise<{
    readonly code: number;
    readonly msg: string;
  }>;
}

export interface Result<T, Error> {
  readonly ok: boolean;
  readonly value?: T;
  readonly error?: Error;
}

export interface HttpClient {
  toJson(resp: Response): Promise<Result<Response, Error>>;
  urlEncode(params: Record<string, string | number | boolean>): string;
  request(path: string, init?: RequestInit): Promise<Result<Response, Error>>;
}

// deno-lint-ignore no-empty-interface
export interface HttpApi<T, Error> {}

export interface BinanceHttpClient extends HttpClient {
  process<T>(resp: Result<Response, Error>): Promise<Result<T, Error>>;
  request(
    path: string,
    init?: RequestInit,
    apit?: { key?: boolean; sign?: boolean },
  ): Promise<Result<Response, Error>>;
}

export interface BinanceHttpApi<T, Error> extends HttpApi<T, Error> {
  request(req: object): Promise<Result<T, Error>>;
}
