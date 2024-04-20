import { IHistoryPriceEntity } from "src/domain/entites";

export class InflationCalculatedDtoV1 {
  id: string;
  name: string;
  inflation: string;
  lastPrice: number;
  currentPrice: number;
}

export interface InflationsByPeriodDtoV1 {
  daily: string;
  weekly: string;
  annualy: string;
}

export interface InflationPricesDtoV1 {
  current: IHistoryPriceEntity[];
  previous: IHistoryPriceEntity[];
}
