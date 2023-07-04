import { ProductSimple, PRODUCT_SOURCE } from "../../domain";
import { PriceLevels } from "../../domain/price-levels";

export class CompareNode {
  liquidLevels: PriceLevels | null = null;
  blendedLevels: PriceLevels | null = null;
  product: ProductSimple;

  constructor(product: ProductSimple) {
    this.product = product;
  }

  handleUpdate = (priceLevels: PriceLevels) => {
    switch (priceLevels.product.source) {
      case PRODUCT_SOURCE.LIQUID:
        this.liquidLevels = priceLevels;
        break;
      case PRODUCT_SOURCE.BLENDING:
        this.blendedLevels = priceLevels;
        break;
    }
    this.compare();
  };

  compare() {
    if (this.liquidLevels === null || this.blendedLevels === null) {
      return;
    }
    if (
      this.liquidLevels.buys.levels.length === 0 ||
      this.blendedLevels.buys.levels.length === 0
    ) {
      return;
    }
    if (
      this.liquidLevels.sell.levels.length === 0 ||
      this.blendedLevels.sell.levels.length === 0
    ) {
      return;
    }
    //console.log(this.blendedLevels.product);

    // console.log({
    //   blendedBuyTob: this.blendedLevels.buys.levels[0][0],
    //   liquidSellTob: this.liquidLevels.sell.levels[0][0],
    // });

    // console.log({
    //   liquidBuyTob: this.liquidLevels.buys.levels[0][0],
    //   blendedSellTob: this.blendedLevels.sell.levels[0][0],
    // });

    const liquidBuyTob = this.liquidLevels.buys.levels[0][0];
    const blendedSellTob = this.blendedLevels.sell.levels[0][0];

    const sellDelta = (liquidBuyTob - blendedSellTob) / blendedSellTob;

    if (sellDelta > 0.001) {
      //   console.log("Arb oppourtinity", {
      //     sellDelta,
      //     liquidBuyTob,
      //     blendedSellTob,
      //   });
    }
  }
}
