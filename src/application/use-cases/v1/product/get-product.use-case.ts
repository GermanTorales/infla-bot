import { Inject, Injectable } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IProductEntity } from "src/domain/entites";
import { IProductRepository } from "src/domain/repositories";

@Injectable()
export class GetProductV1 {
  constructor(@Inject(PORT.Product) private readonly productRepository: IProductRepository) {}

  async exec(id: string) {
    const product: IProductEntity = await this.productRepository.findOneById(id);

    return product;
  }
}
