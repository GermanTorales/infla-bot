import { Inject, Injectable } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IProductEntity } from "src/domain/entites";
import { IProductRepository } from "src/domain/repositories";

@Injectable()
export class GetProductV1 {
  constructor(@Inject(PORT.Product) private readonly productRepository: IProductRepository) {}

  async exec(id: string) {
    const product: IProductEntity = await this.productRepository.findOneById(id);

    product.prices = product.prices.sort((a, b) => b.date.getTime() - a.date.getTime());

    const prices = product.prices.reduce((acc, price) => {
      const date = price.date.toISOString().split("T")[0];

      if (!acc[date]) acc[date] = [];

      acc[date].push(price);

      return acc;
    }, {});

    return { ...product, prices };
  }
}
