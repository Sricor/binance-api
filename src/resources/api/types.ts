export type CoinSymbols = string[] | CoinSymbol[];

// deno-fmt-ignore
export enum CoinSymbol {
  BTCUSDT = "BTCUSDT",
  ETHUSDT = "ETHUSDT",
}

// deno-fmt-ignore
export const enum Interval {
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
