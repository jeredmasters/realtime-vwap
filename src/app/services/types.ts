import { LiquidProduct } from "../resources";

export interface MarketTree {
  ccy1: string;
  ccy2: string;
  symbol: string;
  product?: LiquidProduct;
  crosses?: Array<MarketTreeCross>;
}

export interface MarketTreeCross {
  symbolA: string;
  symbolB: string;
  crossing: string;
}
