import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";

import { CreateProductDtoV1, GetPricesParams } from "src/application/dtos";
import { CreateProductV1, GetAllProductsV1, GetPricesV1, GetProductPricesV1, GetProductV1 } from "src/application/use-cases";

@Controller({ path: "products", version: "1" })
export class ProductController {
  constructor(
    private readonly createUseCase: CreateProductV1,
    private readonly getAllUseCase: GetAllProductsV1,
    private readonly getPricesUseCase: GetPricesV1,
    private readonly getProductUseCase: GetProductV1,
    private readonly getProductPricesUseCase: GetProductPricesV1,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() data: CreateProductDtoV1) {
    await this.createUseCase.exec(data);

    return {};
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    return await this.getAllUseCase.exec();
  }

  @Get("current/prices/:productId")
  @HttpCode(HttpStatus.OK)
  async getPrices(@Param("productId") productId: string) {
    return await this.getProductPricesUseCase.exec(productId);
  }

  @Get("prices/:source")
  @HttpCode(HttpStatus.OK)
  async getPricesBySource(@Param() params: GetPricesParams) {
    return await this.getPricesUseCase.exec(params.source);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async exec(@Param("id") id: string) {
    return this.getProductUseCase.exec(id);
  }
}
