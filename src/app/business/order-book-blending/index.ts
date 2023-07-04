import { dependency, ServiceManager } from "@foal/core";
import { SIDE } from "../../const";
import { ProductBlended, ProductSimple, PRODUCT_SOURCE } from "../../domain";
import { LiquidProduct } from "../../resources";
import { LiquidService } from "../../services";
import { invertSymbol, selectLadder, vwap } from "../../utils/order-book";
import { BlendingNode } from "./blending-node";
import { CompareNode } from "./compare-node";
import { InputNode } from "./input-node";
import { CrossPair, DagNode } from "./types";

export class OrderBookBlending {
  @dependency
  serviceManager: ServiceManager;

  @dependency
  liquidService: LiquidService;

  nodes: Array<DagNode> = [];

  compareNode;

  async getRate(
    sellCcy: string,
    buyCcy: string,
    quantity: number,
    qtySide: SIDE
  ) {
    const node = await this.buildNodeFromSymbol({
      base: sellCcy,
      terms: buyCcy,
      symbol: `${sellCcy}/${buyCcy}`,
      source: PRODUCT_SOURCE.REQUEST,
    });
    node.onUpdate((p) => {
      const ladder = selectLadder(p, sellCcy, buyCcy, qtySide);
      if (ladder !== null) {
        console.log(vwap(ladder, quantity));
      }
    });
  }

  async buildCompare(product: ProductSimple) {
    const inputNode = await this.buildInputNode(product);
    if (inputNode === null) {
      throw new Error("No available market");
    }

    const blendingNode = await this.buildBlendingNode(product);
    if (blendingNode === null) {
      throw new Error("No crossing markets");
    }

    const compareNode = new CompareNode(product);
    inputNode.onUpdate(compareNode.handleUpdate);
    blendingNode.onUpdate(compareNode.handleUpdate);
  }

  async buildNodeFromSymbol(product: ProductSimple) {
    const exists = this.getExistingNode(product.symbol);
    if (exists) {
      return exists;
    }

    const inputNode = await this.buildInputNode(product);
    if (inputNode) {
      return inputNode;
    }

    const blendingNode = await this.buildBlendingNode(product);
    if (blendingNode) {
      return blendingNode;
    }

    throw new Error(`Unable to create node for ${product.symbol}`);
  }

  getExistingNode(symbol: string) {
    return this.nodes.find(
      (n) =>
        n.product.symbol === symbol || n.product.symbol === invertSymbol(symbol)
    );
  }

  async buildInputNode(product: ProductSimple): Promise<DagNode | null> {
    const liquidProduct = await this.liquidService.getProductBySymbol(
      product.symbol
    );
    if (liquidProduct !== undefined) {
      const node = new InputNode(liquidProduct, this.serviceManager);
      this.nodes.push(node);
      return node;
    }
    const invertedProduct = await this.liquidService.getProductBySymbol(
      invertSymbol(product.symbol)
    );
    if (invertedProduct !== undefined) {
      const node = new InputNode(invertedProduct, this.serviceManager);
      this.nodes.push(node);
      return node;
    }
    return null;
  }

  async buildBlendingNode(product: ProductSimple) {
    const crossingPairs = await this.getSymbolTree(product.base, product.terms);
    console.log({ crossingPair: crossingPairs[0] });

    if (crossingPairs.length > 0) {
      const nodeA = await this.buildNodeFromSymbol(crossingPairs[0].productA);
      const nodeB = await this.buildNodeFromSymbol(crossingPairs[0].productB);
      const node = new BlendingNode(crossingPairs[0]);
      nodeA.onUpdate(node.handleUpdate);
      nodeB.onUpdate(node.handleUpdate);
      this.nodes.push(node);
      return node;
    }

    return null;
  }

  async getSymbolTree(
    ccy1: string,
    ccy2: string
  ): Promise<Array<ProductBlended>> {
    if (ccy1 === ccy2) {
      return [];
    }

    const liquidProducts = await this.liquidService.getProducts();
    const existingNodes = this.nodes.map((n) => n.product);
    const products: Array<ProductSimple> = [
      ...liquidProducts,
      ...existingNodes,
    ];
    const crossing = await this.getCrossing(products, ccy1, ccy2);

    const crossProducts = products.filter(
      (p) => crossing.includes(p.base) || crossing.includes(p.terms)
    );

    return crossing.map((c): ProductBlended => {
      const productA = crossProducts.find(
        (p) =>
          (p.base === ccy1 || p.terms === ccy1) &&
          (p.base === c || p.terms === c)
      );
      const productB = crossProducts.find(
        (p) =>
          (p.base === ccy2 || p.terms === ccy2) &&
          (p.base === c || p.terms === c)
      );

      if (productA === undefined) {
        throw new Error(`Cross product not found: ${ccy1} / ${c}`);
      }
      if (productB === undefined) {
        throw new Error(`Cross product not found: ${ccy2} / ${c}`);
      }

      return {
        base: ccy1,
        terms: ccy2,
        cross: c,
        symbol: `${ccy1}/${ccy2}`,
        productA,
        productB,
        source: PRODUCT_SOURCE.BLENDING,
      };
    });
  }

  async getCrossing(
    products: Array<ProductSimple>,
    ccy1: string,
    ccy2: string
  ): Promise<Array<string>> {
    if (ccy1 === ccy2) {
      return [];
    }

    const ccy1Crossing = products
      .filter((p) => p.base === ccy1 || p.terms === ccy1)
      .map((p) => (p.base === ccy1 ? p.terms : p.base));
    const ccy2Crossing = products
      .filter((p) => p.base === ccy2 || p.terms === ccy2)
      .map((p) => (p.base === ccy2 ? p.terms : p.base));

    return ccy1Crossing.filter((c) => ccy2Crossing.includes(c));
  }
}
