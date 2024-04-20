import { Inject, Injectable } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { CreateProductDtoV1 } from "src/application/dtos";
import { IProductRepository } from "src/domain/repositories";
import { EProductStatus, IProductEntity } from "src/domain/entites";

@Injectable()
export class CreateProductV1 {
  constructor(@Inject(PORT.Product) private readonly productRepository: IProductRepository) {}

  async exec(data: CreateProductDtoV1) {
    const newProduct: IProductEntity = {
      name: data.name,
      coto_url: data.coto_url,
      carrefour_url: data.carrefour_url,
      dia_url: data.dia_url,
      status: EProductStatus.ACTIVE,
      updated_at: new Date(),
      image: null,
    };

    await this.productRepository.create(newProduct);

    return {
      name: data.name,
      coto: Boolean(data.coto_url),
      carrefour: Boolean(data.carrefour_url),
      dia: Boolean(data.dia_url),
    };
  }
}
