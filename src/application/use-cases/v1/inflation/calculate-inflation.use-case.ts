import { Inject, Injectable, Logger } from "@nestjs/common";

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

    const inflation = this._calculateInflation(products, yesterdayPrices, todayPrices);

    return inflation.filter(e => e);
  }

  private _calculateInflation(products: IProductEntity[], yesterdayPrices: IHistoryPriceEntity[], todayPrices: IHistoryPriceEntity[]) {
    const inflationByProducts = products.map(product => {
      const yesterdayPrice = yesterdayPrices.find(price => price.product.id === product.id);
      const todayPrice = todayPrices.find(price => price.product.id === product.id);

      if (!yesterdayPrice || !todayPrice) {
        this.logger.error(`Price not found for product: ${product.id}`);

        return;
      }

      const inflation = ((todayPrice.price - yesterdayPrice.price) / yesterdayPrice.price) * 100;

      return {
        id: product.id,
        name: product.name,
        inflation: inflation.toFixed(2),
        lastPrice: yesterdayPrice.price,
        currentPrice: todayPrice.price,
      };
    });

    return inflationByProducts;
  }
}
