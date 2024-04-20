import { Inject, Injectable } from "@nestjs/common";
import { PORT } from "src/application/enums";
import { IHistoryPriceEntity, IProductEntity } from "src/domain/entites";
import { IProductRepository } from "src/domain/repositories";

@Injectable()
export class PriceChartV1 {
  constructor(@Inject(PORT.Product) private readonly productRepository: IProductRepository) {}

  async exec(id: string) {
    const product: IProductEntity = await this.productRepository.findOneById(id);

    const priceSorted = product.prices.sort((a, b) => a.date.getTime() - b.date.getTime());

    const pricesByDate = priceSorted.reduce((acc, price: IHistoryPriceEntity) => {
      const date = price.date.toISOString().split("T")[0];

      if (!acc[date]) acc[date] = { name: date };

      acc[date] = { ...acc[date], [price.source]: price.price };

      return acc;
    }, {});

    return Object.values(pricesByDate);
  }
}
