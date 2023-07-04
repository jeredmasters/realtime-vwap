import { EventEmitter } from "events";
import { ProductBlended, ProductSimple } from "../../../domain";
import { PriceLevels } from "../../../domain/price-levels";
import { getBaseBook, OrderBook } from "../../../utils/order-book";
import { DagNode, UpdateHandler } from "../types";
import { blendLadders } from "./const";

export class BlendingNode implements DagNode {
  crossTermsBook: PriceLevels | null = null;
  crossBaseBook: PriceLevels | null = null;
  product: ProductBlended;

  eventEmitter = new EventEmitter();

  constructor(product: ProductBlended) {
    this.product = product;
  }

  handleUpdate = (priceLevels: PriceLevels) => {
    if (
      this.product.terms === priceLevels.product.base ||
      this.product.terms === priceLevels.product.terms
    ) {
      this.crossTermsBook = getBaseBook(priceLevels, this.product.cross);
    } else {
      this.crossBaseBook = getBaseBook(priceLevels, this.product.cross);
    }
    this.blend();
  };

  blend = () => {
    if (this.crossBaseBook === null || this.crossTermsBook === null) {
      return;
    }

    // const flokiEthSell = blendLadders(usdtethBook.buys, usdtflokiBook.sell);

    if (this.crossTermsBook.sell.levels.length > 0) {
      const termsTob = this.crossTermsBook.sell.levels[0][0];

      const baseTob = this.crossBaseBook.buys.levels[0][0];
      console.log({
        termsTob: 1 / termsTob,
        baseTob: 1 / baseTob,
        tob: 1 / baseTob / (1 / termsTob),
      });
    }
    const newPriceLevels: PriceLevels = {
      product: this.product,
      buys: blendLadders(this.crossTermsBook.sell, this.crossBaseBook.buys),
      sell: blendLadders(this.crossTermsBook.buys, this.crossBaseBook.sell),
      timestamp: Date.now(),
    };

    //console.log(newPriceLevels);

    this.eventEmitter.emit("update", newPriceLevels);
  };

  blendBuyLadder() {
    if (this.crossBaseBook === null || this.crossTermsBook === null) {
      return;
    }
  }

  onUpdate(func: UpdateHandler) {
    this.eventEmitter.on("update", func);
  }
}
