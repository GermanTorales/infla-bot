import { Inject, Injectable } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IHistoryPriceEntity, IProductEntity } from "src/domain/entites";
import { IHistoryPriceRepository, IProductRepository } from "src/domain/repositories";

@Injectable()
export class GetProductPricesV1 {
  constructor(
    @Inject(PORT.Product) private readonly productRepository: IProductRepository,
    @Inject(PORT.HistoryPrice) private readonly historyPriceRepository: IHistoryPriceRepository,
  ) {}

  async exec(id: string) {
    const product: IProductEntity = await this.productRepository.findOneById(id);

    const currentPrices: IHistoryPriceEntity[] = await this.historyPriceRepository.findCurrent(product);

    product.prices = currentPrices;

    return product;
  }
}
