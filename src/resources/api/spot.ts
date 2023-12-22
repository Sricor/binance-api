import type { BinanceHttpApi, BinanceHttpClient, Error } from "../types.ts";
import {
  CoinSymbol,
  OrderResp,
  OrderSide,
  OrderTimeInForce,
  OrderType,
  SelfTradePreventionMode,
} from "./types.ts";

// deno-fmt-ignore
const enum API {
  Order     = `/api/v3/order`,
  OrderTest = `/api/v3/order/test`,
}

export class Order
  implements BinanceHttpApi<OrderAckData | OrderResultData | OrderFullData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params: OrderRequest) {
    type Response = OrderAckData | OrderResultData | OrderFullData;
    params = { timestamp: new Date().getTime(), ...params };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.Order}${this.client.urlEncode({ ...params })}`,
        { method: "POST" },
        { key: true, sign: true },
      ),
    );
  }
}

export class OrderTest implements BinanceHttpApi<OrderCommissionData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params: OrderTestRequest) {
    type Response = OrderCommissionData;
    params = { timestamp: new Date().getTime(), ...params };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.OrderTest}${this.client.urlEncode({ ...params })}`,
        { method: "POST" },
        { key: true, sign: true },
      ),
    );
  }
}

// deno-fmt-ignore
interface OrderBase {
  symbol:                   CoinSymbol;
  side:                     OrderSide;
  type:                     OrderType;
  quantity?:                number;
  quoteOrderQty?:           number;
  price?:                   number;
  newClientOrderId?:        string;
  strategyId?:              number;
  strategyType?:            number;
  stopPrice?:               number;
  trailingDelta?:           number;
  icebergQty?:              number;
  newOrderRespType?:        OrderResp;
  recvWindow?:              number;
  timestamp?:               number;
  timeInForce?:             OrderTimeInForce;
  selfTradePreventionMode?: SelfTradePreventionMode;
}

// deno-fmt-ignore
interface LimitOrderRequest extends OrderBase {
  type:        "LIMIT";
  price:       number;
  quantity:    number;
  timeInForce: OrderTimeInForce;
}

// deno-fmt-ignore
interface MarketOrderRequest extends OrderBase {
  type:     "MARKET";
  quantity: number;
}

// deno-fmt-ignore
interface StopLossOrderRequest extends OrderBase {
  type:          "STOP_LOSS";
  quantity:      number;
  stopPrice:     number;
  trailingDelta: number;
}

// deno-fmt-ignore
interface StopLossLimitOrderRequest extends OrderBase {
  type:         "STOP_LOSS_LIMIT";
  quantity:      number;
  price:         number;
  stopPrice:     number;
  trailingDelta: number;
  timeInForce:   OrderTimeInForce;
}

// deno-fmt-ignore
interface TakeProfitOrderRequest extends OrderBase {
  type:         "TAKE_PROFIT";
  quantity:      number;
  stopPrice:     number;
  trailingDelta: number;
}

// deno-fmt-ignore
interface TakeProfitLimitOrderRequest extends OrderBase {
  type:          "TAKE_PROFIT_LIMIT";
  quantity:      number;
  price:         number;
  stopPrice:     number;
  trailingDelta: number;
  timeInForce:   OrderTimeInForce;
}

// deno-fmt-ignore
interface LimitMakerOrderRequest extends OrderBase {
  type:     "LIMIT_MAKER";
  quantity: number;
  price:    number;
}

type OrderRequest =
  | LimitOrderRequest
  | MarketOrderRequest
  | StopLossOrderRequest
  | StopLossLimitOrderRequest
  | TakeProfitOrderRequest
  | TakeProfitLimitOrderRequest
  | LimitMakerOrderRequest;

// deno-fmt-ignore
interface OrderAckData {
  symbol:        CoinSymbol;
  orderId:       number;
  clientOrderId: string;
  transactTime:  number;
}

// deno-fmt-ignore
interface OrderResultData {
  symbol:                  CoinSymbol;
  orderId:                 number;
  clientOrderId:           string;
  transactTime:            number;
  price:                   string;
  origQty:                 string;
  executedQty:             string;
  status:                  string;
  workingTime:             number;
  cummulativeQuoteQty:     string;
  type:                    OrderType;
  side:                    OrderSide;
  timeInForce:             OrderTimeInForce;
  selfTradePreventionMode: SelfTradePreventionMode;
  icebergQty?:             string;
  preventedMatchId?:       number;
  preventedQuantity?:      string;
  stopPrice?:              string;
  strategyId?:             number;
  trailingDelta?:          number;
  trailingTime?:           number;
  usedSor?:                boolean;
  workingFloor?:           string;
}

// deno-fmt-ignore
interface Fill {
  price:           string;
  qty:             string;
  tradeId:         number;
  commission:      string;
  commissionAsset: string;
}

// deno-fmt-ignore
interface OrderFullData {
  symbol:                  CoinSymbol;
  orderId:                 number;
  price:                   string;
  origQty:                 string;
  executedQty:             string;
  status:                  string;
  timeInForce:             string;
  type:                    string;
  side:                    string;
  workingTime:             number;
  fills:                   Fill[];
  transactTime:            number;
  clientOrderId:           string;
  cummulativeQuoteQty:     string;
  selfTradePreventionMode: string;
}

// deno-fmt-ignore
interface OrderCommissionData {
  standardCommissionForOrder: {
    maker: string;
    taker: string;
  };
  taxCommissionForOrder: {
    maker: string;
    taker: string;
  };
  discount: {
    enabledForAccount: boolean;
    enabledForSymbol:  boolean;
    discountAsset:     string;
    discount:          string;
  };
}

interface OrderTestRequest extends OrderBase {
  computeCommissionRates?: boolean;
}
