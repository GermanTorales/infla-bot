import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PORT } from "src/application/enums";
import * as Events from "src/infrastructure/events";
import * as UseCases from "src/application/use-cases";
import * as Controllers from "src/infrastructure/controllers";
import * as Repositories from "src/infrastructure/repositories";
import { HistoryPriceEntity, ProductEntity } from "src/domain/entites";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, HistoryPriceEntity])],
  controllers: [Controllers.ProductController],
  providers: [
    UseCases.CreateProductV1,
    UseCases.GetAllProductsV1,
    UseCases.GetPricesV1,
    UseCases.GetProductV1,
    UseCases.GetProductPricesV1,
    UseCases.CalculateInflationV1,
    UseCases.GetProductsCountV1,
    Events.InflationEventListenerV1,
    { provide: PORT.Product, useClass: Repositories.ProductRepository },
    { provide: PORT.HistoryPrice, useClass: Repositories.HistoryPriceRepository },
  ],
  exports: [UseCases.GetPricesV1],
})
export class ProductModule {}
