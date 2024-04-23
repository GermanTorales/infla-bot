import { Inject, Injectable } from "@nestjs/common";
import { PORT } from "src/application/enums";
import { IProductRepository } from "src/domain/repositories";

@Injectable()
export class GetProductsCountV1 {
  constructor(@Inject(PORT.Product) private readonly productRepository: IProductRepository) {}

  async exec(): Promise<number> {
    return await this.productRepository.count();
  }
}
