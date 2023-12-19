export const enum ErrorType {
  Err = "Err",
  RequestErr = "RequestErr",
  BinanceHttpApiErr = "BinanceHttpApiErr",
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
  get(req: RequestParams): Promise<Result<Response, Error>>;
  post(req: RequestParams): Promise<Result<Response, Error>>;
}

export interface HttpApi<T, Error> {
  request(): Promise<Result<T, Error>>;
}

export interface BinanceHttpClient extends HttpClient {
  process<T>(resp: Result<Response, Error>): Promise<Result<T, Error>>;
}

// deno-lint-ignore no-empty-interface
export interface BinanceHttpApi<T, Error> extends HttpApi<T, Error> {}

export type RequestParams = {
  path: string;
  params?: { [key: string]: string };
  headers?: HeadersInit;
  body?: BodyInit;
};

export type CoinSymbols = string[] | CoinSymbol[];
export enum CoinSymbol {
  BTCUSDT = "BTCUSDT",
  ETHUSDT = "ETHUSDT",
}
