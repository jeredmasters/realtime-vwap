export interface ProductSimple {
  symbol: string;
  base: string;
  terms: string;
  source: PRODUCT_SOURCE;
}
export enum PRODUCT_SOURCE {
  REQUEST = "REQUEST",
  LIQUID = "LIQUID",
  BLENDING = "BLENDING",
}

export interface ProductBlended extends ProductSimple {
  productA: ProductSimple;
  productB: ProductSimple;
  cross: string;
  source: PRODUCT_SOURCE.BLENDING;
}

export interface ProductLiquid extends ProductSimple {
  id: string;
  currencyPair: string;
  source: PRODUCT_SOURCE.LIQUID;
}
