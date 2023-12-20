import { BinanceHttpClient } from "@resources/client.ts";
import * as API from "@resources/index.ts";

interface BinanceConfig {
  api: string;
}

export class Binance extends BinanceHttpClient {
  // deno-fmt-ignore
  api = {
    market: {
      price:            new API.Price(this),
      klines:           new API.Klines(this),
      avgPrice:         new API.AvgPrice(this),
      tradingDay:       new API.TradingDay(this),
      bookTicker:       new API.BookTicker(this),
      roundPriceChange: new API.RoundPriceChange(this),
    },
  };

  constructor(config?: BinanceConfig) {
    super({
      baseUrl: config?.api || "https://api.binance.com",
    });
  }
}
