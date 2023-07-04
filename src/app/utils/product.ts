import { PRODUCT_SOURCE } from "../domain";

export const productFromSymbol = (
  symbol: string,
  source: PRODUCT_SOURCE = PRODUCT_SOURCE.REQUEST
) => {
  const parts = symbol.split("/");
  return {
    base: parts[0],
    terms: parts[1],
    symbol,
    source,
  };
};
