import type { BinanceHttpApi, BinanceHttpClient, Error } from "../types.ts";
import {
  CoinSymbol,
  OrderResp,
  OrderSide,
  OrderStatus,
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

export class OrderTracking implements BinanceHttpApi<OrderTrackingData, Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params: OrderTrackingRequest) {
    type Response = OrderTrackingData;
    params = { timestamp: new Date().getTime(), ...params };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.Order}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
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
  quantity?:                string;
  quoteOrderQty?:           string;
  price?:                   string;
  newClientOrderId?:        string;
  strategyId?:              number;
  strategyType?:            number;
  stopPrice?:               string;
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
  price:       string;
  quantity:    string;
  timeInForce: OrderTimeInForce;
}

// deno-fmt-ignore
interface MarketOrderRequest extends OrderBase {
  type:     "MARKET";
  quantity: string;
}

// deno-fmt-ignore
interface StopLossOrderRequest extends OrderBase {
  type:          "STOP_LOSS";
  quantity:      string;
  stopPrice:     string;
  trailingDelta: number;
}

// deno-fmt-ignore
interface StopLossLimitOrderRequest extends OrderBase {
  type:         "STOP_LOSS_LIMIT";
  quantity:      string;
  price:         string;
  stopPrice:     string;
  trailingDelta: number;
  timeInForce:   OrderTimeInForce;
}

// deno-fmt-ignore
interface TakeProfitOrderRequest extends OrderBase {
  type:         "TAKE_PROFIT";
  quantity:      string;
  stopPrice:     string;
  trailingDelta: number;
}

// deno-fmt-ignore
interface TakeProfitLimitOrderRequest extends OrderBase {
  type:          "TAKE_PROFIT_LIMIT";
  quantity:      string;
  price:         string;
  stopPrice:     string;
  trailingDelta: number;
  timeInForce:   OrderTimeInForce;
}

// deno-fmt-ignore
interface LimitMakerOrderRequest extends OrderBase {
  type:     "LIMIT_MAKER";
  quantity: string;
  price:    string;
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
interface OrderTrackingRequest {
  symbol:             CoinSymbol; // trading pair (required)
  orderId?:           number;     // system order ID (required)
  origClientOrderId?: string;     // original client order ID (optional)
  recvWindow?:        number;     // receive window (optional, must not be greater than 60000)
  timestamp?:         number;     // timestamp (required)
}

// deno-fmt-ignore
interface OrderTrackingData {
  symbol:                  CoinSymbol;              // trading pair
  type:                    OrderType;               // order type, such as market order, limit order, etc.
  side:                    OrderSide;               // order side, buy or sell  
  status:                  OrderStatus;             // order status
  orderId:                 number;                  // system order ID
  orderListId:             number;                  // OCO order ID, otherwise -1
  clientOrderId:           string;                  // client's own ID
  price:                   string;                  // order price
  origQty:                 string;                  // original order quantity set by user
  executedQty:             string;                  // quantity of the order that has been executed
  cummulativeQuoteQty:     string;                  // cumulative amount of the order
  stopPrice:               string;                  // stop price
  icebergQty:              string;                  // iceberg quantity
  time:                    number;                  // order time
  updateTime:              number;                  // last update time
  isWorking:               boolean;                 // whether the order is on the order book
  workingTime:             number;                  // working time of the order
  origQuoteOrderQty:       string;                  // original quote order quantity
  timeInForce:             OrderTimeInForce;        // time in force for the order
  selfTradePreventionMode: SelfTradePreventionMode; // self-trade prevention mode
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
