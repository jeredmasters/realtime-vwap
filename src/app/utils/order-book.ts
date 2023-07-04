import { cloneLadder } from "../business/order-book-blending/blending-node/const";
import { SIDE } from "../const";
import {
  ProductLiquid,
  ProductSimple,
  PRODUCT_SOURCE,
  Quote,
  QUOTE_STATE,
} from "../domain";
import { Ladder, PriceLevel, PriceLevels } from "../domain/price-levels";
import {
  LiquidPriceLevelsApi,
  LiquidPriceLevelsWs,
  LiquidProduct,
} from "../resources";

export class OrderBook {
  priceLevels: PriceLevels;
  constructor(priceLevels: PriceLevels) {
    this.priceLevels = priceLevels;
  }

  getCounter(side: SIDE, quantity: number, currency: string) {
    const currencyIsBase = this.priceLevels.product.base === currency;
    if (currencyIsBase) {
      // todo
    }
  }

  getLadder(side: SIDE, currency: string): Ladder {
    const currencyIsBase = this.priceLevels.product.base === currency;
    if (currencyIsBase) {
      switch (side) {
        case SIDE.buy:
          return this.priceLevels.buys;
        case SIDE.sell:
          return this.priceLevels.sell;
      }
    } else {
      switch (side) {
        case SIDE.buy:
          return invertLadder(this.priceLevels.sell);
        case SIDE.sell:
          return invertLadder(this.priceLevels.buys);
      }
    }
  }
}

export const selectLadder = (
  priceLevels: PriceLevels,
  sellCcy: string,
  buyCcy: string,
  qtySide: SIDE
): Ladder | null => {
  const qtyCcy = qtySide === SIDE.sell ? sellCcy : buyCcy;
  const book =
    priceLevels.product.base === qtyCcy
      ? priceLevels
      : invertPriceLevels(priceLevels);
  return sellCcy === book.product.base ? book.sell : book.buys;
};

export const vwap = (ladder: Ladder, quantity: number): number => {
  if (ladder.levels.length === 0) {
    throw new Error("Cannot call vwap with empty ladder");
  }

  let index = 0;
  let remainingQuantity = quantity;
  let currentCost = 0;
  while (
    index < ladder.levels.length - 1 &&
    remainingQuantity > ladder.levels[index][1]
  ) {
    if (ladder.levels[index] === undefined) {
      throw new Error(
        `VWAP bad index ${index} ${ladder.symbol} ${ladder.side} ${ladder.levels}`
      );
    }
    currentCost += ladder.levels[index][0] * ladder.levels[index][1];
    remainingQuantity -= ladder.levels[index][1];
    index++;
  }
  if (ladder.levels.length > index) {
    currentCost += ladder.levels[index][0] * remainingQuantity;
  }
  return currentCost;
};

export const clonePriceLevels = (priceLevels: PriceLevels): PriceLevels => {
  return {
    product: priceLevels.product,
    buys: cloneLadder(priceLevels.buys),
    sell: cloneLadder(priceLevels.sell),
    timestamp: priceLevels.timestamp,
  };
};

export const invertPriceLevels = (priceLevels: PriceLevels): PriceLevels => {
  return {
    product: invertProduct(priceLevels.product),
    buys: invertLadder(priceLevels.sell),
    sell: invertLadder(priceLevels.buys),
    timestamp: priceLevels.timestamp,
  };
};

export const getBaseBook = (
  priceLevels: PriceLevels,
  baseCcy: string
): PriceLevels => {
  if (priceLevels.product.base === baseCcy) {
    return priceLevels;
  }
  return invertPriceLevels(priceLevels);
};

export const invertProduct = (product: ProductSimple): ProductSimple => {
  return {
    symbol: invertSymbol(product.symbol),
    base: product.terms,
    terms: product.base,
    source: product.source,
  };
};

export const invertLadder = (ladder: Ladder): Ladder => {
  return {
    symbol: invertSymbol(ladder.symbol),
    side: invertSide(ladder.side),
    levels: invertLevels(ladder.levels),
  };
};

export const invertLevels = (levels: Array<PriceLevel>): Array<PriceLevel> =>
  levels.map(([p, v]) => [1 / p, p * v]);

export const invertSymbol = (symbol: string): string => {
  const parts = symbol.split("/");
  return `${parts[1]}/${parts[0]}`;
};

export const invertSide = (side: SIDE): SIDE =>
  side === SIDE.buy ? SIDE.sell : SIDE.buy;

export const normalizeProduct = (product: LiquidProduct): ProductLiquid => {
  const symbol = `${product.base_currency}/${product.quoted_currency}`;
  return {
    base: product.base_currency,
    terms: product.quoted_currency,
    symbol: symbol,
    source: PRODUCT_SOURCE.LIQUID,
    currencyPair: product.currency_pair_code.toLowerCase(),
    id: product.id,
  };
};

export const normalizePriceLevelsApi = (
  product: LiquidProduct,
  priceLevels: LiquidPriceLevelsApi
): PriceLevels => {
  const symbol = `${product.base_currency}/${product.quoted_currency}`;
  return {
    product: normalizeProduct(product),
    timestamp: Math.floor(Number(priceLevels.timestamp) * 1000),
    buys: {
      symbol: symbol,
      side: SIDE.buy,
      levels: priceLevels.buy_price_levels.map(([p, v]) => [
        Number(p),
        Number(v),
      ]),
    },
    sell: {
      symbol: symbol,
      side: SIDE.sell,
      levels: priceLevels.sell_price_levels.map(([p, v]) => [
        Number(p),
        Number(v),
      ]),
    },
  };
};

export const normalizePriceLevelsWs = (
  product: ProductLiquid,
  priceLevels: LiquidPriceLevelsWs
): PriceLevels => {
  return {
    product: product,
    timestamp: Math.floor(Number(priceLevels.timestamp) * 1000),
    buys: {
      symbol: product.symbol,
      side: SIDE.buy,
      levels: priceLevels.bids.map(([p, v]) => [Number(p), Number(v)]),
    },
    sell: {
      symbol: product.symbol,
      side: SIDE.sell,
      levels: priceLevels.asks.map(([p, v]) => [Number(p), Number(v)]),
    },
  };
};
