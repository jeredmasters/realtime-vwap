import { dependency } from "@foal/core";
import { EnvConfig } from "../utils/env-config";
import { TapClient } from "liquid-tap";
import { LiquidPriceLevelsWs, LiquidProduct } from "./types";
import { PriceLevels } from "../domain/price-levels";
import { Callback } from "../domain";

export class LiquidWs {
  @dependency
  env: EnvConfig;

  tap = new TapClient();

  listenProduct(productId: string, symbol: string, callback: (d: any) => void) {
    const channel = `product_cash_${symbol}_${productId}`;
    console.log({ channel });
    const public_channel = this.tap.subscribe(channel);
    public_channel.bind("updated", callback);
  }

  listenPriceLevels(symbol: string, callback: Callback<LiquidPriceLevelsWs>) {
    const channel = `price_ladders_cash_${symbol}`;
    const public_channel = this.tap.subscribe(channel);
    public_channel.bind("updated", (raw: string) => callback(JSON.parse(raw)));
  }
}
