import { strictEqual } from "assert";
import {
  getBaseBook,
  normalizePriceLevelsApi,
} from "../../../utils/order-book";
import { blendLadders } from "./const";
import {
  ETHUSDT,
  ETHUSDT_LADDER,
  FLOKIUSDT,
  FLOKIUSDT_LADDER,
} from "./fixtures";

describe("BlendingUtil", () => {
  it("Blend", async () => {
    const flokiusdtBook = normalizePriceLevelsApi(FLOKIUSDT, FLOKIUSDT_LADDER);

    const ethusdtBook = normalizePriceLevelsApi(ETHUSDT, ETHUSDT_LADDER);

    const usdtflokiBook = getBaseBook(flokiusdtBook, "USDT");
    const usdtethBook = getBaseBook(ethusdtBook, "USDT");

    const flokiEthBuy = blendLadders(usdtflokiBook.buys, usdtethBook.sell);

    strictEqual(flokiEthBuy.levels[0][0], 139983571.42857143);
    strictEqual(flokiEthBuy.levels[1][0], 130651333.33333333);
    strictEqual(flokiEthBuy.levels[2][0], 122485624.99999999);
    strictEqual(flokiEthBuy.levels[3][0], 115280588.2352941);
    strictEqual(flokiEthBuy.levels[4][0], 115260588.23529412);
  });
  it("Sell 1 ETH, buy FLOKI", () => {
    /*
      1. We want the sell ladder from USDT/ETH (so that we can buy the sell orders to get USDT)
         -> which is the inverted buy ladder from ETH/USDT
      2. We want the buy ladder from USDT/FLOKI (as that we can sell USDT to get FLOKI)
         -> which is the inverted sell ladder from FLOKI/USDT
      3. This builds a sell FLOKI/ETH ladder, full of order to sell FLOKI which the user can buy
    */

    const ethusdtBook = normalizePriceLevelsApi(ETHUSDT, ETHUSDT_LADDER);
    const flokiusdtBook = normalizePriceLevelsApi(FLOKIUSDT, FLOKIUSDT_LADDER);

    const usdtethBook = getBaseBook(ethusdtBook, "USDT");
    const usdtflokiBook = getBaseBook(flokiusdtBook, "USDT");

    const flokiEthSell = blendLadders(usdtethBook.buys, usdtflokiBook.sell);
  });
});
