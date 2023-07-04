import { SIDE } from "../const";
import { ProductSimple } from "./product";

export interface PriceLevels {
  buys: Ladder;
  sell: Ladder;
  timestamp: number;
  product: ProductSimple;
}

export type Ladder = {
  levels: Array<PriceLevel>;
  symbol: string;
  side: SIDE;
};

export type PriceLevel = [number, number];
