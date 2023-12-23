import { BinanceHttpClient } from "./resources/client.ts";
import * as API from "./resources/api/index.ts";

export interface BinanceConfig {
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
      exchangeInfo:     new API.ExchangeInfo(this),
      roundPriceChange: new API.RoundPriceChange(this),
    },
    wallet: {
      userAsset:        new API.UserAsset(this),
      fundingAsset:     new API.FundingAsset(this),
      walletBalance:    new API.WalletBalance(this),
      depositHistory:   new API.DepositHistory(this),
      withdrawHistory:  new API.WithdrawHistory(this),
    },
    spot: {
      order:            new API.Order(this),
      orderTest:        new API.OrderTest(this),
      orderTracking:    new API.OrderTracking(this)
    }
  };

  constructor(config?: BinanceConfig) {
    super({
      baseUrl: config?.api || "https://api.binance.com",
    });
  }
}
