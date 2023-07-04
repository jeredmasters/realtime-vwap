export interface LiquidPriceLevelsApi {
  buy_price_levels: Array<LiquidPriceLevel>;
  sell_price_levels: Array<LiquidPriceLevel>;
  timestamp: string;
}

export interface LiquidPriceLevelsWs {
  bids: Array<LiquidPriceLevel>;
  asks: Array<LiquidPriceLevel>;
  timestamp: string;
}

export type LiquidPriceLevel = [string, string];

export interface LiquidProduct {
  id: string;
  product_type: string;
  code: string;
  name: string | null;
  market_ask: number;
  market_bid: number;
  indicator: number | null;
  currency: string;
  currency_pair_code: string;
  symbol: string | null;
  btc_minimum_withdraw: null;
  fiat_minimum_withdraw: null;
  pusher_channel: string;
  taker_fee: string;
  maker_fee: string;
  low_market_bid: string;
  high_market_ask: string;
  volume_24h: string;
  last_price_24h: string;
  last_traded_price: string;
  last_traded_quantity: string;
  average_price: string;
  quoted_currency: string;
  base_currency: string;
  tick_size: string;
  disabled: boolean;
  margin_enabled: boolean;
  cfd_enabled: boolean;
  perpetual_enabled: false;
  last_event_timestamp: string;
  timestamp: string;
  multiplier_up: string;
  multiplier_down: string;
  average_time_interval: number;
  progressive_tier_eligible: boolean;
  exchange_rate: string | number;
  matching_state: string;
}

export interface LiquidBalances {
  crypto_accounts: Array<LiquidBalanceCrypto>;
  fiat_accounts: Array<LiquidBalanceFiat>;
}

export interface LiquidBalanceCrypto {
  id: 3062492;
  currency: "FTT";
  balance: "0.0";
  reserved_balance: "0.0";
  staked_balance: "0.0";
  pusher_channel: "user_624217_account_ftt";
  lowest_offer_interest_rate: null;
  highest_offer_interest_rate: null;
  category: "trading";
  address: "0xb99f05d19c5076d7313c2661ab8f4e8464116102";
  currency_symbol: "FTT";
  minimum_withdraw: null;
  currency_type: "crypto";
}

export interface LiquidBalanceFiat {
  id: 958822;
  currency: "SGD";
  balance: "4.33803";
  reserved_balance: "0.0";
  staked_balance: "0.0";
  pusher_channel: "user_624217_account_sgd";
  lowest_offer_interest_rate: null;
  highest_offer_interest_rate: null;
  category: "trading";
  currency_symbol: "S$";
  send_to_btc_address: null;
  exchange_rate: "0.72525454848940076781839425819325";
  currency_type: "fiat";
}
