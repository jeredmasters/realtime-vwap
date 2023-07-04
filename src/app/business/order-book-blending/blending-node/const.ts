import { Ladder, PriceLevel } from "../../../domain/price-levels";

const P = 0; // price
const V = 1; // volume

export const blendLadders = (baseX: Ladder, termsY: Ladder) => {
  const [, baseCcy] = baseX.symbol.split("/");
  const [, termsCcy] = termsY.symbol.split("/");

  const ladder: Ladder = {
    symbol: `${baseCcy}/${termsCcy}`,
    side: baseX.side,
    levels: [],
  };
  baseX.levels.sort(([ap, av], [bp, bv]) => (ap < bp ? 1 : -1));
  termsY.levels.sort(([ap, av], [bp, bv]) => (ap > bp ? 1 : -1));

  let baseIndex = 0;
  let termsIndex = 0;

  while (baseIndex < baseX.levels.length && termsIndex < termsY.levels.length) {
    const b = baseX.levels[baseIndex];
    const t = termsY.levels[termsIndex];

    const p = b[P] / t[P];
    let v: number | undefined;
    if (b[V] < t[V]) {
      v = b[V];
      t[V] = t[V] - v;
      baseIndex += 1;
    } else {
      v = t[V];
      b[V] = b[V] - v;
      termsIndex += 1;
    }
    ladder.levels.push([p, v]);
  }

  return ladder;
};

export const cloneLadder = (ladder: Ladder): Ladder => ({
  symbol: ladder.symbol,
  side: ladder.side,
  levels: ladder.levels.map(([p, v]): PriceLevel => [p, v]),
});
