import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PORT } from "src/application/enums";
import * as UseCases from "src/application/use-cases";
import * as Repositories from "src/infrastructure/repositories";
import { PuppeteerService } from "src/infrastructure/dependencies";
import { InflationControllerV1 } from "src/infrastructure/controllers";
import { HistoryPriceEntity, ProductEntity } from "src/domain/entites";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, HistoryPriceEntity])],
  controllers: [InflationControllerV1],
  providers: [
    UseCases.GeneralV1,
    UseCases.CalculateInflationV1,
    UseCases.DailySourceInflationV1,
    PuppeteerService,
    { provide: PORT.Product, useClass: Repositories.ProductRepository },
    { provide: PORT.HistoryPrice, useClass: Repositories.HistoryPriceRepository },
  ],
  exports: [],
})
export class InflationModule {}
