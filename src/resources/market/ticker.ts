import type {
  BinanceHttpApi,
  BinanceHttpClient,
  CoinSymbol,
  CoinSymbols,
  Error,
} from "../types.ts";

// deno-fmt-ignore
enum API {
  RoundPriceChange =  `/api/v3/ticker/24hr`,
  TradingDay       =  `/api/v3/ticker/tradingDay`,
  Price            =  `/api/v3/ticker/price`,
  BookTicker       =  `/api/v3/ticker/bookTicker`,
  Klines           =  `/api/v3/klines`,
  AvgPrice         =  `/api/v3/avgPrice`
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

  public async request(params?: SymbolsParams) {
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

  public async request(params?: SymbolsParams) {
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

// https://binance-docs.github.io/apidocs/spot/en/#uiklines
export class Klines implements BinanceHttpApi<KlineData[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params: KlineRequest) {
    type Response = KlineData[];
    return await this.client.process<Response>(
      await this.client.get({
        path: API.Klines,
        params: {
          symbol: params.symbol,
          interval: params.interval,
          startTime: params.startTime?.toString() || "",
          endTime: params.endTime?.toString() || "",
          timeZone: params.timeZone?.toString() || "",
          limit: params.limit?.toString() || "",
        },
      }),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#uiklines
export class AvgPrice implements BinanceHttpApi<AvgPriceData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params: { symbol: CoinSymbol }) {
    type Response = AvgPriceData;
    return await this.client.process<Response>(
      await this.client.get({
        path: API.AvgPrice,
        params: {
          symbol: params.symbol,
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

// deno-fmt-ignore
interface BookTickerResponse {
  symbol:   CoinSymbol;
  bidPrice: string;
  bidQty:   string;
  askPrice: string;
  askQty:   string;
}

// deno-fmt-ignore
interface AvgPriceData {
  min:       number,  // Average price interval (in minutes)
  price:     string,  // Average price
  closeTime: number   // Last trade time
}

// deno-fmt-ignore
const enum Interval {
  oneSecond      = "1s",
  oneMinute      = "1m",
  threeMinutes   = "3m",
  fiveMinutes    = "5m",
  fifteenMinutes = "15m",
  thirtyMinutes  = "30m",
  oneHour        = "1h",
  twoHours       = "2h",
  fourHours      = "4h",
  sixHours       = "6h",
  eightHours     = "8h",
  twelveHours    = "12h",
  oneDay         = "1d",
  threeDays      = "3d",
  oneWeek        = "1w",
  oneMonth       = "1M"
}

// deno-fmt-ignore
interface KlineRequest {
  symbol:     string | CoinSymbol; 
  interval:   string | Interval;
  startTime?: number;     
  endTime?:   number;
  timeZone?:  string;
  limit?:     number;
}

// deno-fmt-ignore
type KlineData = [
  number,   // Kline open time
  string,   // Open price
  string,   // High price
  string,   // Low price
  string,   // Close price
  string,   // Volume
  number,   // Kline close time
  string,   // Quote asset volume
  number,   // Number of trades
  string,   // Taker buy base asset volume
  string,   // Taker buy quote asset volume
  string    // Unused field. Ignore.
];
