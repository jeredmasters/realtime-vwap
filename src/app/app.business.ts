import { dependency } from "@foal/core";
import { OrderBookBlending } from "./business";
import { SIDE } from "./const";
import { PRODUCT_SOURCE } from "./domain";
import { LiquidApi } from "./resources";
import { productFromSymbol } from "./utils/product";

export class AppBusiness {
  @dependency
  orderBookBlending: OrderBookBlending;

  @dependency
  liquidApi: LiquidApi;

  async init() {
    // const balance = await this.liquidApi.fetchBalance();
    // console.log(JSON.stringify(balance));
    await this.orderBookBlending.buildCompare(productFromSymbol("BTC/USD"));
    // await this.orderBookBlending.getRate("USDT", "XRP", 1, SIDE.sell);
    // return this.orderBookBlending.getRate("XRP", "FLOKI", 1, SIDE.sell);
  }
}
