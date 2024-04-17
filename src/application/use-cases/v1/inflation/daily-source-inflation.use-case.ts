import { Inject, Injectable } from "@nestjs/common";

import { calculateInflation } from "src/application/utils";
import { INFLATION_PERIOD, PORT } from "src/application/enums";
import { InflationCalculatedDtoV1 } from "src/application/dtos";
import { IHistoryPriceRepository, IProductRepository } from "src/domain/repositories";
import { EProductSource, IHistoryPriceEntity, IProductEntity } from "src/domain/entites";

@Injectable()
export class DailySourceInflationV1 {
  constructor(
    @Inject(PORT.Product) private readonly productRepository: IProductRepository,
    @Inject(PORT.HistoryPrice) private readonly historyPriceRepository: IHistoryPriceRepository,
  ) {}

  async exec(source: EProductSource) {
    const products: IProductEntity[] = await this.productRepository.findBySource(source);

    const todayPrices: IHistoryPriceEntity[] = await this.historyPriceRepository.findPricesByDate(INFLATION_PERIOD.TODAY, source);
    const yesterdayPrices: IHistoryPriceEntity[] = await this.historyPriceRepository.findPricesByDate(INFLATION_PERIOD.YESTERDAY, source);

    const inflation: InflationCalculatedDtoV1[] = calculateInflation(products, yesterdayPrices, todayPrices);

    const generalInflation: number = inflation.reduce((acc, curr: InflationCalculatedDtoV1) => {
      return acc + parseFloat(curr.inflation);
    }, 0);

    const formatedInflation = generalInflation / inflation.length;

    return { source, products: inflation, general: formatedInflation.toFixed(2) };
  }
}
