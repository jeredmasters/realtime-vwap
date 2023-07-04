import { ProductSimple } from "../../domain";
import { PriceLevels } from "../../domain/price-levels";

export type UpdateHandler = (priceLevels: PriceLevels) => void;

export interface DagNode {
  product: ProductSimple;
  onUpdate(func: UpdateHandler);
  handleUpdate: UpdateHandler;
}

export interface CrossPair {
  productA: ProductSimple;
  productB: ProductSimple;
  crossing: string;
}
