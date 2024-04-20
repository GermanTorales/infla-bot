import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import * as UseCases from "src/application/use-cases";
import * as Controllers from "src/infrastructure/controllers";
import * as Repositories from "src/infrastructure/repositories";
import { HistoryPriceEntity, ProductEntity } from "src/domain/entites";
import { PORT } from "src/application/enums";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, HistoryPriceEntity])],
  controllers: [Controllers.ChartControllerV1],
  providers: [UseCases.PriceChartV1, { provide: PORT.Product, useClass: Repositories.ProductRepository }],
  exports: [],
})
export class ChartModule {}
