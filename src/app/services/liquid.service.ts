import { dependency } from "@foal/core";
import { UpdateHandler } from "../business/order-book-blending/types";
import {
  ApiResult,
  ProductLiquid,
  ProductSimple,
  PRODUCT_SOURCE,
} from "../domain";

import { LiquidApi, LiquidProduct, LiquidWs } from "../resources";
import { PubSub } from "../utils";
import { normalizePriceLevelsWs, normalizeProduct } from "../utils/order-book";
import { PUBSUB_EVENTS } from "../utils/pubsub/const";

export class LiquidService {
  @dependency
  pubsub: PubSub;

  @dependency
  liquidApi: LiquidApi;

  @dependency
  liquidWs: LiquidWs;

  async getProducts(): Promise<Array<ProductLiquid>> {
    const response = await this.liquidApi.fetchProducts();
    return response.payload.map(normalizeProduct);
  }

  async getProductBySymbol(symbol: string): Promise<ProductLiquid | undefined> {
    const products = await this.getProducts();
    return products.find((p) => p.symbol === symbol);
  }

  async listenPriceLevels(product: ProductLiquid, callback: UpdateHandler) {
    return this.liquidWs.listenPriceLevels(product.currencyPair, (p) => {
      callback(normalizePriceLevelsWs(product, p));
    });
  }
}
