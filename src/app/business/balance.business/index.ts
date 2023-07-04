import { dependency } from "@foal/core";
import { LiquidApi } from "../../resources";

export class BalanceBusiness {
  @dependency
  liquidApi: LiquidApi;
}
