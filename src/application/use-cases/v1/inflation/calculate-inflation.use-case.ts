import { Inject, Injectable, Logger } from "@nestjs/common";

import { calculateInflation } from "src/application/utils";
import { INFLATION_PERIOD, PORT } from "src/application/enums";
import { IHistoryPriceEntity, IProductEntity } from "src/domain/entites";
import { IHistoryPriceRepository, IProductRepository } from "src/domain/repositories";

@Injectable()
export class CalculateInflationV1 {
  private logger: Logger = new Logger(CalculateInflationV1.name);

  constructor(
    @Inject(PORT.Product) private readonly productRepository: IProductRepository,
    @Inject(PORT.HistoryPrice) private readonly historyPriceRepository: IHistoryPriceRepository,
  ) {}

  async exec() {
    const products: IProductEntity[] = await this.productRepository.findAll();

    const yesterdayPrices: IHistoryPriceEntity[] = await this.historyPriceRepository.findPricesByDate(INFLATION_PERIOD.YESTERDAY);
    const todayPrices: IHistoryPriceEntity[] = await this.historyPriceRepository.findPricesByDate(INFLATION_PERIOD.TODAY);

    return calculateInflation(products, yesterdayPrices, todayPrices);
  }
}
