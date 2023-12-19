import { BinanceHttpClient } from "@resources/client.ts";
import * as API from "@resources/index.ts";

interface BinanceConfig {
  api: string;
}

export class Binance extends BinanceHttpClient {
  api = {
    ticker: {
      roundPriceChange: new API.RoundPriceChange(this),
      tradingDay: new API.TradingDay(this),
      price: new API.Price(this),
      bookTicker: new API.BookTicker(this),
    },
  };

  constructor(config?: BinanceConfig) {
    super({
      baseUrl: config?.api || "https://api.binance.com",
    });
  }
}
