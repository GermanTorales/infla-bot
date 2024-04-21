import { Inject, Injectable } from "@nestjs/common";

import { calculateInflation } from "src/application/utils";
import { INFLATION_PERIOD, PORT } from "src/application/enums";
import { IHistoryPriceRepository, IProductRepository } from "src/domain/repositories";
import { EProductSource, IHistoryPriceEntity, IProductEntity } from "src/domain/entites";
import { InflationCalculatedDtoV1, InflationPricesDtoV1, InflationsByPeriodDtoV1 } from "src/application/dtos";

@Injectable()
export class GeneralV1 {
  constructor(
    @Inject(PORT.Product) private readonly productRepository: IProductRepository,
    @Inject(PORT.HistoryPrice) private readonly historyPriceRepository: IHistoryPriceRepository,
  ) {}

  async exec() {
    const cotoInflation: InflationsByPeriodDtoV1 = await this.getInflations(EProductSource.COTO);
    const carrefourInflation: InflationsByPeriodDtoV1 = await this.getInflations(EProductSource.CARREFOUR);
    const diaInflation: InflationsByPeriodDtoV1 = await this.getInflations(EProductSource.DIA);

    return { coto: cotoInflation, carrefour: carrefourInflation, dia: diaInflation };
  }

  private async getInflations(source: EProductSource): Promise<InflationsByPeriodDtoV1> {
    const products: IProductEntity[] = await this.productRepository.findBySource(source);
    const dailyPrices = await this._getPrices(source, INFLATION_PERIOD.YESTERDAY, INFLATION_PERIOD.TODAY);
    const weeklyPrices = await this._getPrices(source, INFLATION_PERIOD.LAST_WEEK, INFLATION_PERIOD.TODAY);
    const monthlyPrices = await this._getPrices(source, INFLATION_PERIOD.LAST_MONTH, INFLATION_PERIOD.TODAY);

    const dailyInflation: InflationCalculatedDtoV1[] = calculateInflation(products, dailyPrices.previous, dailyPrices.current);
    const weeklyInflation: InflationCalculatedDtoV1[] = calculateInflation(products, weeklyPrices.previous, weeklyPrices.current);
    const monthlyInflation: InflationCalculatedDtoV1[] = calculateInflation(products, monthlyPrices.previous, monthlyPrices.current);

    return {
      daily: this._getInflation(dailyInflation),
      weekly: this._getInflation(weeklyInflation),
      monthly: this._getInflation(monthlyInflation),
    };
  }

  private async _getPrices(source: EProductSource, from: INFLATION_PERIOD, to: INFLATION_PERIOD): Promise<InflationPricesDtoV1> {
    const previous: IHistoryPriceEntity[] = await this.historyPriceRepository.findPricesByDate(from, source);
    const current: IHistoryPriceEntity[] = await this.historyPriceRepository.findPricesByDate(to, source);

    return { current, previous };
  }

  private _getInflation(inflationNumbers: InflationCalculatedDtoV1[]): string {
    if (!inflationNumbers.length) return "0.00";

    const generalInflation: number = inflationNumbers.reduce((acc, curr: InflationCalculatedDtoV1) => {
      return acc + parseFloat(curr.inflation);
    }, 0);

    const formatedInflation = generalInflation / inflationNumbers.length;

    return formatedInflation.toFixed(2);
  }
}
