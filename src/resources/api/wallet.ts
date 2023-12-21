import type { BinanceHttpApi, BinanceHttpClient, Error } from "../types.ts";

//deno-fmt-ignore
const enum API {
  DepositHistory  = `/sapi/v1/capital/deposit/hisrec`,
  WithdrawHistory = `/sapi/v1/capital/withdraw/history`,
  FundingAsset    = `/sapi/v1/asset/get-funding-asset`,
  UserAsset       = `/sapi/v3/asset/getUserAsset`,
  WalletBalance   = `/sapi/v1/asset/wallet/balance`,
}

// https://binance-docs.github.io/apidocs/spot/en/#deposit-history-supporting-network-user_data
export class DepositHistory implements BinanceHttpApi<DepositHistoryData[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: DepositHistoryRequest) {
    type Response = DepositHistoryData[];
    params = { ...params, timestamp: new Date().getTime() };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.DepositHistory}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
        { key: true, sign: true },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#withdraw-history-supporting-network-user_data
export class WithdrawHistory implements BinanceHttpApi<WithdrawHistoryData[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: WithdrawHistoryRequest) {
    type Response = WithdrawHistoryData[];
    params = { ...params, timestamp: new Date().getTime() };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.WithdrawHistory}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
        { key: true, sign: true },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#funding-wallet-user_data
export class FundingAsset implements BinanceHttpApi<FundingAssetData[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: FundingAssetRequest) {
    type Response = FundingAssetData[];
    params = { ...params, timestamp: new Date().getTime() };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.FundingAsset}${this.client.urlEncode({ ...params })}`,
        { method: "POST" },
        { key: true, sign: true },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#query-user-wallet-balance-user_data
export class WalletBalance implements BinanceHttpApi<WalletBalanceData[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: WalletBalanceRequest) {
    type Response = WalletBalanceData[];
    params = { ...params, timestamp: new Date().getTime() };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.WalletBalance}${this.client.urlEncode({ ...params })}`,
        { method: "GET" },
        { key: true, sign: true },
      ),
    );
  }
}

// https://binance-docs.github.io/apidocs/spot/en/#user-asset-user_data
export class UserAsset implements BinanceHttpApi<UserAssetData[], Error> {
  constructor(protected client: BinanceHttpClient) {}

  public async request(params?: UserAssetRequest) {
    type Response = UserAssetData[];
    params = { ...params, timestamp: new Date().getTime() };
    return await this.client.process<Response>(
      await this.client.request(
        `${API.UserAsset}${this.client.urlEncode({ ...params })}`,
        { method: "POST" },
        { key: true, sign: true },
      ),
    );
  }
}

//deno-fmt-ignore
interface DepositHistoryRequest {
    coin?:          string;
    includeSource?: boolean;            // default false
    status?:        0 | 1 | 6 | 7 | 8;  // 0: pending, 6: credited but cannot withdraw,7=Wrong Deposit,8=Waiting User confirm, 1: success
    startTime?:     number;             // default timestamp 90 days before current time
    endTime?:       number;             // default current timestamp
    offset?:        number;             // default: 0
    limit?:         number;             // default: 1000 max: 1000
    recvWindow?:    number;
    txId?:          string;
    timestamp?:     number;
}

//deno-fmt-ignore
interface DepositHistoryData {
    id:            string;
    amount:        string;
    coin:          string;
    network:       string;
    status:        number;
    address:       string;
    addressTag:    string;
    txId:          string;
    insertTime:    number;
    transferType:  number;
    confirmTimes:  string;
    unlockConfirm: number;
    walletType:    number;
}

//deno-fmt-ignore
interface WithdrawHistoryRequest {
    coin?:            string;
    withdrawOrderId?: string;
    status?:          0 | 1 | 2 | 3 | 4 | 5 | 6;
    offset?:          number;
    limit?:           number;
    startTime?:       number;
    endTime?:         number;
    recvWindow?:      number;
    timestamp?:        number;
}

//deno-fmt-ignore
interface WithdrawHistoryData {
    id:               string;  // The withdrawal ID on Binance
    amount:           string;  // The amount of the withdrawal
    transactionFee:   string;  // The transaction fee
    coin:             string;  // The cryptocurrency
    status:           number;  // The status of the withdrawal (0: sent confirmation email, 1: canceled by user, 2: waiting for confirmation, 3: rejected, 4: processing, 5: withdrawal transaction failed, 6: withdrawal completed)
    address:          string;  // The withdrawal address
    txId:             string;  // The withdrawal transaction ID
    applyTime:        string;  // The time when the withdrawal was applied (UTC time)
    network:          string;  // The network (e.g., ETH)
    transferType:     number;  // The transfer type (1: internal transfer, 0: external transfer)
    withdrawOrderId?: string;  // Custom ID, not returned if not available
    info?:            string;  // The reason for withdrawal failure
    confirmNo:        number;  // The number of confirmations for the withdrawal
    walletType:       number;  // The wallet type (1: funding wallet, 0: spot wallet)
    txKey:            string;  // The transaction key
    completeTime:     string;  // The time when the withdrawal was completed and successful (UTC time)
}

//deno-fmt-ignore
interface FundingAssetRequest {
    asset?:            string;  // The asset symbol
    needBtcValuation?: string;  // Whether BTC valuation is needed (true or false)
    recvWindow?:       number;  // The window in milliseconds
    timestamp?:         number;  // The timestamp of the request
}

//deno-fmt-ignore
interface FundingAssetData {
    asset:        string;  // The asset symbol
    free:         string;  // Available balance
    locked:       string;  // Locked balance
    freeze:       string;  // Frozen balance
    withdrawing:  string;  // Withdrawal in process
    btcValuation: string;  // BTC valuation
}

//deno-fmt-ignore
interface UserAssetRequest {
    asset?:            string;   // The asset symbol. If empty, it will query all positive assets of the user.
    needBtcValuation?: boolean;  // Whether to return the valuation in BTC
    recvWindow?:       number;   // The window in milliseconds
    timestamp?:         number;   // The timestamp of the request
}

//deno-fmt-ignore
interface UserAssetData {
    asset:        string;  // The asset symbol
    free:         string;  // Available balance
    locked:       string;  // Locked balance
    freeze:       string;  // Frozen balance
    withdrawing:  string;  // Withdrawal in process
    ipoable:      string;  // IPOable balance
    btcValuation: string;  // BTC valuation
}

//deno-fmt-ignore
interface WalletBalanceRequest {
    recvWindow?: number;  // The window in milliseconds
    timestamp?:   number;  // The timestamp of the request
}

//deno-fmt-ignore
interface WalletBalanceData {
    activate:   boolean;  // Whether the wallet is activated
    balance:    string;   // The balance of the wallet
    walletName: string;   // The name of the wallet (e.g., Spot)
}
