import type { BinanceHttpApi, BinanceHttpClient, Error } from "../types.ts";
import type {
  CoinSymbol,
  Filters,
  Interval,
  LimitIntervalType,
  OrderType,
  RateLimitType,
} from "./types.ts";

// deno-fmt-ignore
const enum API {
  Klines           =  `/api/v3/klines`,
  AvgPrice         =  `/api/v3/avgPrice`,
  Price            =  `/api/v3/ticker/price`,
  BookTicker       =  `/api/v3/ticker/bookTicker`,
  TradingDay       =  `/api/v3/ticker/tradingDay`,
  ExchangeInfo     =  `/api/v3/exchangeInfo`,
  RoundPriceChange =  `/api/v3/ticker/24hr`,
}

// https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics
export class RoundPriceChange implements BinanceHttpApi<RoundPriceChangeFullData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: RoundPriceChangeRequest) {
    type Response = RoundPriceChangeFullData;
    return await this.client.process<Response>(
      await this.client.request(
        `${API.RoundPriceChange}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#trading-day-ticker
export class TradingDay implements BinanceHttpApi<TradingDayFullData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: TradingDayRequest) {
    type Response = TradingDayFullData;
    return await this.client.process<Response>(
      await this.client.request(
        `${API.TradingDay}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker
export class Price implements BinanceHttpApi<PriceData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: PriceRequest) {
    type Response = PriceData;
    return await this.client.process<Response>(
      await this.client.request(
        `${API.Price}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker
export class BookTicker implements BinanceHttpApi<BookTickerData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: BookTickerRequest) {
    type Response = BookTickerData;
    return await this.client.process<Response>(
      await this.client.request(
        `${API.BookTicker}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#exchange-information
export class ExchangeInfo implements BinanceHttpApi<ExchangeInfoData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: ExchangeInfoRequest) {
    type Response = ExchangeInfoData;
    return await this.client.process<Response>(
      await this.client.request(
        `${API.ExchangeInfo}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
export class Klines implements BinanceHttpApi<KlineData[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params: KlineRequest) {
    type Response = KlineData[];
    return await this.client.process<Response>(
      await this.client.request(
        `${API.Klines}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#current-average-price
export class AvgPrice implements BinanceHttpApi<AvgPriceData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params: AvgPriceRequest) {
    type Response = AvgPriceData;
    return await this.client.process<Response>(
      await this.client.request(
        `${API.AvgPrice}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
      ),
    );
  }
}

const enum ResponseType {
  Full = "FULL",
  Mini = "MINI",
}

interface AvgPriceRequest {
  symbol: CoinSymbol;
}

interface PriceRequest {
  symbol?: CoinSymbol;
}

interface BookTickerRequest {
  symbol?: CoinSymbol;
}

// deno-fmt-ignore
interface RoundPriceChangeRequest {
  symbol?:  CoinSymbol;
  type?:    ResponseType;
}

// deno-fmt-ignore
interface TradingDayRequest {
  symbol?:   CoinSymbol;
  type?:     ResponseType;
  timeZone?: string;
}

// deno-fmt-ignore
interface KlineRequest {
  symbol:     CoinSymbol; 
  interval:   Interval;
  startTime?: number;     
  endTime?:   number;
  timeZone?:  string;
  limit?:     number;
}

// deno-fmt-ignore
interface ExchangeInfoRequest {
  symbol?:      CoinSymbol;
  permissions?: string;
}

// deno-fmt-ignore
interface TickerData {
  symbol:      CoinSymbol;
  openPrice:   string;
  highPrice:   string;
  lowPrice:    string;
  lastPrice:   string;
  volume:      string;
  quoteVolume: string;
  openTime:    number;
  closeTime:   number;
  firstId:     number;
  lastId:      number;
  count:       number;
}

// deno-fmt-ignore
interface RoundPriceChangeFullData extends TickerData {
  priceChange:        string;
  priceChangePercent: string;
  weightedAvgPrice:   string;
  prevClosePrice:     string;
  lastQty:            string;
  bidPrice:           string;
  bidQty:             string;
  askPrice:           string;
  askQty:             string;
}

// deno-fmt-ignore
interface TradingDayFullData extends TickerData {
  priceChange:        string;
  priceChangePercent: string;
  weightedAvgPrice:   string;
}

// deno-fmt-ignore
interface PriceData {
  symbol: CoinSymbol;
  price:  string;
}

// deno-fmt-ignore
interface BookTickerData {
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
type KlineData = [
  openTime:    number,   // Kline open time
  openPrice:   string,   // Open price
  highPrice:   string,   // High price
  lowPrice:    string,   // Low price
  closePrice:  string,   // Close price
  volume:      string,   // Volume
  closeTime:   number,   // Kline close time
  assetVolume: string,   // Quote asset volume
  tradesNum:   number,   // Number of trades
  buyBase:     string,   // Taker buy base asset volume
  buyQuote:    string,   // Taker buy quote asset volume
  ignore:      string    // Unused field. Ignore.
];

// deno-fmt-ignore
interface RateLimit {
  rateLimitType: RateLimitType;
  interval:      LimitIntervalType;
  intervalNum:   number;
  limit:         number;
}

// deno-fmt-ignore
interface Symbols {
  symbol:                          CoinSymbol;
  status:                          string;
  baseAsset:                       string;
  baseAssetPrecision:              number;
  quoteAsset:                      string;
  quotePrecision:                  number;
  quoteAssetPrecision:             number;
  baseCommissionPrecision:         number;
  quoteCommissionPrecision:        number;
  orderTypes:                      OrderType[];
  icebergAllowed:                  boolean;
  ocoAllowed:                      boolean;
  quoteOrderQtyMarketAllowed:      boolean;
  allowTrailingStop:               boolean;
  cancelReplaceAllowed:            boolean;
  isSpotTradingAllowed:            boolean;
  isMarginTradingAllowed:          boolean;
  filters:                         Filters[];
  permissions:                     string[];
  defaultSelfTradePreventionMode:  string;
  allowedSelfTradePreventionModes: string[];
}

// deno-fmt-ignore
interface ExchangeInfoData {
  timezone:        string;
  serverTime:      number;
  rateLimits:      RateLimit[];
  symbols:         Symbols[];
  exchangeFilters: [];
}
