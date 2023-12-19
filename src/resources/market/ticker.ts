import type {
  BinanceHttpApi,
  BinanceHttpClient,
  CoinSymbol,
  CoinSymbols,
  Error,
} from "../types.ts";

enum API {
  RoundPriceChange = `/api/v3/ticker/24hr`,
  TradingDay = `/api/v3/ticker/tradingDay`,
  Price = `/api/v3/ticker/price`,
  BookTicker = `/api/v3/ticker/bookTicker`,
}

// https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics
export class RoundPriceChange implements BinanceHttpApi<RoundPriceChangeFullResponse[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: RoundPriceChangeParams) {
    type Response = RoundPriceChangeFullResponse[];
    return await this.client.process<Response>(
      await this.client.get({
        path: API.RoundPriceChange,
        params: {
          symbols: params?.symbols ? JSON.stringify(params.symbols) : "",
          type: params?.type || "",
        },
      }),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#trading-day-ticker
export class TradingDay implements BinanceHttpApi<TradingDayFullResponse[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: TradingDayParams) {
    type Response = TradingDayFullResponse[];
    return await this.client.process<Response>(
      await this.client.get({
        path: API.TradingDay,
        params: {
          symbols: params?.symbols ? JSON.stringify(params.symbols) : "",
          timeZone: params?.timeZone || "",
          type: params?.type || "",
        },
      }),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker
export class Price implements BinanceHttpApi<PriceResponse[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: TradingDayParams) {
    type Response = PriceResponse[];
    return await this.client.process<Response>(
      await this.client.get({
        path: API.Price,
        params: {
          symbols: params?.symbols ? JSON.stringify(params.symbols) : "",
        },
      }),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker
export class BookTicker implements BinanceHttpApi<BookTickerResponse[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: TradingDayParams) {
    type Response = BookTickerResponse[];
    return await this.client.process<Response>(
      await this.client.get({
        path: API.BookTicker,
        params: {
          symbols: params?.symbols ? JSON.stringify(params.symbols) : "",
        },
      }),
    );
  }
}

enum ResponseType {
  Full = "FULL",
  Mini = "MINI",
}

interface SymbolsParams {
  symbols?: CoinSymbols;
}

interface RoundPriceChangeParams extends SymbolsParams {
  type?: string | ResponseType;
}

interface TradingDayParams extends RoundPriceChangeParams {
  timeZone?: string;
}

interface TickerResponse {
  symbol: CoinSymbol;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

interface RoundPriceChangeFullResponse extends TickerResponse {
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
}

interface TradingDayFullResponse extends TickerResponse {
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
}

interface PriceResponse {
  symbol: CoinSymbol;
  price: string;
}

interface BookTickerResponse {
  symbol: CoinSymbol;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
}
