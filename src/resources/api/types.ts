export type CoinSymbols = CoinSymbol[];

export type CoinSymbol =
  | "BTCUSDT"
  | "ETHUSDT";

export type Interval =
  | "1s"
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "8h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";

export type OrderSide =
  | "BUY"
  | "SELL";

export type OrderType =
  | "LIMIT"
  | "MARKET"
  | "STOP_LOSS"
  | "STOP_LOSS_LIMIT"
  | "TAKE_PROFIT"
  | "TAKE_PROFIT_LIMIT"
  | "LIMIT_MAKER";

export type OrderTimeInForce =
  | "GTC"
  | "IOC"
  | "FOK";

export type OrderResp =
  | "ACK"
  | "FULL"
  | "RESULT";

export type OrderStatus =
  | "NEW"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELED"
  | "PENDING_CANCEL"
  | "REJECTED"
  | "EXPIRED"
  | "EXPIRED_IN_MATCH";

export type SelfTradePreventionMode =
  | "EXPIRE_TAKER"
  | "EXPIRE_MAKER"
  | "EXPIRE_BOTH"
  | "None";

export interface Filter {
  filterType: FilterType;
}

// deno-fmt-ignore
export interface PriceFilter extends Filter {
  filterType: "PRICE_FILTER";
  minPrice:   string;
  maxPrice:   string;
  tickSize:   string;
}

// deno-fmt-ignore
export interface PercentPrice  extends Filter {
  filterType:     "PERCENT_PRICE";
  multiplierUp:   string;
  multiplierDown: string;
  avgPriceMins:   number;
}

// deno-fmt-ignore
export interface PercentPriceBySide extends Filter {
  filterType:         "PERCENT_PRICE_BY_SIDE";
  bidMultiplierUp:    string;
  bidMultiplierDown:  string;
  askMultiplierUp:    string;
  askMultiplierDown:  string;
  avgPriceMins:       number;
}

// quantity >= minQty
// quantity <= maxQty
// quantity % stepSize == 0
// deno-fmt-ignore
export interface LotSize extends Filter {
  filterType: "LOT_SIZE";
  minQty:     string;
  maxQty:     string;
  stepSize:   string;
}

// deno-fmt-ignore
export interface MinNotional extends Filter {
  filterType:       "MIN_NOTIONAL";
  minNotional:      string;
  applyMinToMarket: boolean;
  avgPriceMins:     number;
}

// deno-fmt-ignore
export interface Notional extends Filter {
  filterType:       "NOTIONAL";
  maxNotional:      string;
  minNotional:      string;
  applyMaxToMarket: boolean;
  applyMinToMarket: boolean;
  avgPriceMins:     number;
}

// deno-fmt-ignore
export interface MaxNumOrders extends Filter {
  filterType:   "MAX_NUM_ORDERS";
  maxNumOrders: number;
}

// deno-fmt-ignore
export interface MaxNumAlgoOrders extends Filter {
  filterType:       "MAX_NUM_ALGO_ORDERS";
  maxNumAlgoOrders: number;
}

// deno-fmt-ignore
export interface MaxNumIcebergOrders extends Filter {
  filterType:          "MAX_NUM_ICEBERG_ORDERS";
  maxNumIcebergOrders: number;
}

// deno-fmt-ignore
export interface MaxPosition extends Filter {
    filterType:  "MAX_POSITION";
    maxPosition: string;
  }

// deno-fmt-ignore
export interface TrailingDelta extends Filter {
  filterType:            "TRAILING_DELTA";
  minTrailingAboveDelta: number;
  maxTrailingAboveDelta: number;
  minTrailingBelowDelta: number;
  maxTrailingBelowDelta: number;
}

// deno-fmt-ignore
export interface ExchangeMaxNumOrders extends Filter {
  filterType:   "EXCHANGE_MAX_NUM_ORDERS";
  maxNumOrders: number;
}

// deno-fmt-ignore
export interface ExchangeMaxAlgoOrders extends Filter {
  filterType:       "EXCHANGE_MAX_ALGO_ORDERS";
  maxNumAlgoOrders: number;
}

// deno-fmt-ignore
export interface ExchangeMaxNumIcebergOrders extends Filter {
  filterType:          "EXCHANGE_MAX_NUM_ICEBERG_ORDERS";
  maxNumIcebergOrders: number;
}

export type Filters =
  | PriceFilter
  | PercentPrice
  | PercentPriceBySide
  | LotSize
  | MinNotional
  | Notional
  | MaxNumOrders
  | MaxNumAlgoOrders
  | MaxNumIcebergOrders
  | MaxPosition
  | TrailingDelta
  | ExchangeMaxNumOrders
  | ExchangeMaxAlgoOrders
  | ExchangeMaxNumIcebergOrders;

export type FilterType =
  | "PRICE_FILTER"
  | "PERCENT_PRICE"
  | "PERCENT_PRICE_BY_SIDE"
  | "LOT_SIZE"
  | "MIN_NOTIONAL"
  | "NOTIONAL"
  | "ICEBERG_PARTS"
  | "MARKET_LOT_SIZE"
  | "MAX_NUM_ORDERS"
  | "MAX_NUM_ALGO_ORDERS"
  | "MAX_NUM_ICEBERG_ORDERS"
  | "MAX_POSITION"
  | "TRAILING_DELTA"
  | "EXCHANGE_MAX_NUM_ORDERS"
  | "EXCHANGE_MAX_ALGO_ORDERS"
  | "EXCHANGE_MAX_NUM_ICEBERG_ORDERS";

export type RateLimitType =
  | "REQUEST_WEIGHT"
  | "ORDERS"
  | "RAW_REQUESTS";

export type LimitIntervalType =
  | "SECOND"
  | "MINUTE"
  | "DAY";
