import { IHistoryPriceEntity, IProductEntity } from "src/domain/entites";

export interface IHistoryPriceRepository {
  create: (data: IHistoryPriceEntity) => Promise<IHistoryPriceEntity>;
  findCurrent: (product: IProductEntity) => Promise<any>;
  savePrice: (data: IHistoryPriceEntity) => Promise<IHistoryPriceEntity>;
}
