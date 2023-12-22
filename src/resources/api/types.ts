export type CoinSymbols = string[] | CoinSymbol[];

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

export type SelfTradePreventionMode =
  | "EXPIRE_TAKER"
  | "EXPIRE_MAKER"
  | "EXPIRE_BOTH"
  | "None";
