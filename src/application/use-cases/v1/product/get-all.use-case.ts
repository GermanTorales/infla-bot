import { Inject, Injectable } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IProductRepository } from "src/domain/repositories";

@Injectable()
export class GetAllProductsV1 {
  constructor(@Inject(PORT.Product) private readonly productRepository: IProductRepository) {}

  async exec() {
    return await this.productRepository.findAll();
  }
}
