import { dependency } from "@foal/core";
import { ONE_DAY } from "../const/time";
import { ApiResult } from "../domain";
import { EnvConfig } from "../utils/env-config";
import { Http } from "../utils/http";
import { PromiseMerger } from "../utils/query-merger";
import { LiquidBalances, LiquidPriceLevelsApi, LiquidProduct } from "./types";
import * as jwt from "jwt-simple";

export class LiquidApi {
  @dependency
  http: Http;

  @dependency
  env: EnvConfig;

  promiseMerger = new PromiseMerger({
    cacheTimeoutMs: ONE_DAY,
  });

  jwt(path: string) {
    return jwt.encode(
      {
        token_id: this.env.liquidApiTokenId(),
        path: path,
      },
      this.env.liquidApiSecret()
    );
  }

  fetchProducts(): Promise<ApiResult<Array<LiquidProduct>>> {
    return this.promiseMerger.query("fetchProducts", () =>
      this.http.call({
        method: "get",
        url: `${this.env.liquidBaseUrl()}/products`,
      })
    );
  }

  fetchProduct(productId: string): Promise<ApiResult<LiquidProduct>> {
    return this.promiseMerger.query(`/products/${productId}`, () =>
      this.http.call({
        method: "get",
        url: `${this.env.liquidBaseUrl()}/products/${productId}`,
      })
    );
  }

  fetchPriceLevels(
    productId: string
  ): Promise<ApiResult<LiquidPriceLevelsApi>> {
    return this.promiseMerger.query(`/products/${productId}/price_levels`, () =>
      this.http.call({
        method: "get",
        url: `${this.env.liquidBaseUrl()}/products/${productId}/price_levels`,
      })
    );
  }

  fetchBalance(): Promise<ApiResult<LiquidBalances>> {
    return this.promiseMerger.query(`/accounts`, () =>
      this.http.call({
        method: "get",
        url: `${this.env.liquidBaseUrl()}/accounts`,
        headers: {
          "X-Quoine-Auth": this.jwt(`/accounts`),
        },
      })
    );
  }
}
