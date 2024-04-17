import { INFLATION_PERIOD } from "src/application/enums";
import { EProductSource, IHistoryPriceEntity, IProductEntity } from "src/domain/entites";

export interface IHistoryPriceRepository {
  create: (data: IHistoryPriceEntity) => Promise<IHistoryPriceEntity>;
  findCurrent: (product: IProductEntity) => Promise<any>;
  savePrice: (data: IHistoryPriceEntity) => Promise<IHistoryPriceEntity>;
  findPricesByDate: (type: INFLATION_PERIOD, source?: EProductSource) => Promise<IHistoryPriceEntity[]>;
}
