import * as dayjs from "dayjs";
import { Injectable } from "@nestjs/common";
import { Between, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { IHistoryPriceRepository } from "src/domain/repositories";
import { HistoryPriceEntity, IHistoryPriceEntity, IProductEntity } from "src/domain/entites";

@Injectable()
export class HistoryPriceRepository implements IHistoryPriceRepository {
  constructor(@InjectRepository(HistoryPriceEntity) private readonly historyPriceModel: Repository<HistoryPriceEntity>) {}

  async create(data: IHistoryPriceEntity): Promise<IHistoryPriceEntity> {
    return await this.historyPriceModel.save(this.historyPriceModel.create(data));
  }

  async findCurrent(product: IProductEntity): Promise<IHistoryPriceEntity[]> {
    const start = dayjs().startOf("day").toDate();
    const end = dayjs().endOf("day").toDate();

    return await this.historyPriceModel.find({ where: { created_at: Between(start, end), product } });
  }

  async savePrice(data: IHistoryPriceEntity): Promise<IHistoryPriceEntity> {
    const start = dayjs().startOf("day").toDate();
    const end = dayjs().endOf("day").toDate();

    const existingPrice = await this.historyPriceModel.findOne({
      where: { product: data.product, date: Between(start, end), source: data.source },
    });

    if (!existingPrice) return await this.create(data);

    return existingPrice;
  }
}
