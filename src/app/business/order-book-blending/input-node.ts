import { LiquidProduct } from "../../resources";
import { ServiceManager } from "@foal/core";
import { DagNode, UpdateHandler } from "./types";
import { EventEmitter } from "events";
import { PriceLevels } from "../../domain/price-levels";
import { LiquidService } from "../../services";
import { ProductLiquid, ProductSimple } from "../../domain";

export class InputNode implements DagNode {
  product: ProductLiquid;

  liquisService: LiquidService;

  eventEmitter = new EventEmitter();

  constructor(product: ProductLiquid, serviceManager: ServiceManager) {
    this.product = product;
    this.liquisService = serviceManager.get(LiquidService);
    this.liquisService.listenPriceLevels(this.product, this.handleUpdate);
  }

  handleUpdate: UpdateHandler = (priceLevels: PriceLevels) => {
    this.eventEmitter.emit("update", priceLevels);
  };

  onUpdate(func: UpdateHandler) {
    this.eventEmitter.on("update", func);
  }
}
