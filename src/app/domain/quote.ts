export enum QUOTE_STATE {
  INDICATIVE = "INDICATIVE",
  DEALABLE = "DEALABLE",
  NO_LIQUIDITY = "NO_LIQUIDITY",
}

export interface Quote {
  state: QUOTE_STATE;
  quoted_quantity: number | null;
}
