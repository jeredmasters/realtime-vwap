import { strictEqual } from "assert";
import { SIDE } from "../const";
import { Ladder } from "../domain/price-levels";
import { BTCUSD_PRICELEVELS, BTCUSD_PRODUCT } from "./fixtures";
import {
  invertLadder,
  invertLevels,
  normalizePriceLevelsApi,
  selectLadder,
  vwap,
} from "./order-book";

const validateLadder = (ladder: Ladder) => {
  let a: number | null = null;
  for (const [p, v] of ladder.levels) {
    if (a === null) {
      a = p;
    } else {
      if (ladder.side === SIDE.buy) {
        if (p > a) {
          throw Error("Invalid orderbook direction");
        }
      } else {
        if (p < a) {
          throw Error("Invalid orderbook direction");
        }
      }
    }
  }
};

// Define a group of tests.
describe("OrderBook", () => {
  it("Invert Ladder", () => {
    const btcusd = normalizePriceLevelsApi(BTCUSD_PRODUCT, BTCUSD_PRICELEVELS);
    validateLadder(btcusd.buys);
    validateLadder(btcusd.sell);
    const inverted = invertLadder(btcusd.buys);

    strictEqual(inverted.side, SIDE.sell);
    strictEqual(inverted.symbol, "USD/BTC");
    validateLadder(inverted);
  });
  it("Invert Levels", async () => {
    const inverted = invertLevels([
      [3742560.0, 0.003],
      [3742555.0, 0.00106901],
      [3742549.0, 0.01],
    ]);
    console.log(inverted);
    strictEqual(inverted[0][0], 2.671967850882818e-7);
    strictEqual(inverted[0][1], 11227.68);
    strictEqual(inverted[1][0], 2.6719714205936856e-7);
    strictEqual(inverted[1][1], 4000.82872055);
  });
  describe("selectLadder", () => {
    const btcusdPriceLevels = {
      base: "BTC",
      terms: "USD",
      buys: {
        levels: [],
        side: SIDE.buy,
        symbol: "BTC/USD",
      },
      sell: {
        levels: [],
        side: SIDE.sell,
        symbol: "BTC/USD",
      },
      symbol: "BTC/USD",
      timestamp: Date.now(),
    };
    it("Buy BTC/USD. QTYCCY = USD", () => {
      const ladder = selectLadder(btcusdPriceLevels, "USD", "BTC", SIDE.sell);
      if (ladder !== null) {
        strictEqual(ladder.symbol, "USD/BTC");
        strictEqual(ladder.side, SIDE.sell);
      }
    });

    it("Buy BTC/USD. QTYCCY = BTC", () => {
      const ladder = selectLadder(btcusdPriceLevels, "USD", "BTC", SIDE.buy);
      if (ladder !== null) {
        strictEqual(ladder.symbol, "BTC/USD");
        strictEqual(ladder.side, SIDE.buy);
      }
    });

    it("Sell BTC/USD. QTYCCY = USD", () => {
      const ladder = selectLadder(btcusdPriceLevels, "BTC", "USD", SIDE.buy);
      if (ladder !== null) {
        strictEqual(ladder.symbol, "USD/BTC");
        strictEqual(ladder.side, SIDE.buy);
      }
    });

    it("Sell BTC/USD. QTYCCY = BTC", () => {
      const ladder = selectLadder(btcusdPriceLevels, "BTC", "USD", SIDE.sell);
      if (ladder !== null) {
        strictEqual(ladder.symbol, "BTC/USD");
        strictEqual(ladder.side, SIDE.sell);
      }
    });
  });
  describe("vwap", () => {
    it("Buy 1 BTC: BTC/USD", () => {
      const quoted_quantity = vwap(
        {
          side: SIDE.buy,
          symbol: "BTC/USD",
          levels: [
            [30545.5, 2.40480632],
            [30533.97, 0.37862667],
            [30527.07, 0.37476314],
            [30514.9, 0.4018079],
          ],
        },
        1
      );
      strictEqual(quoted_quantity, 30545.5);
    });
    it("Buy 3 BTC: BTC/USD", () => {
      const quoted_quantity = vwap(
        {
          side: SIDE.buy,
          symbol: "BTC/USD",
          levels: [
            [30545.5, 2.40480632],
            [30533.97, 0.37862667],
            [30527.07, 0.37476314],
            [30514.9, 0.4018079],
          ],
        },
        3
      );
      strictEqual(quoted_quantity, 91628.1431045006);
    });
  });
});
