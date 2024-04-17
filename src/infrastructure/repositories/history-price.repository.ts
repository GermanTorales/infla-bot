import * as dayjs from "dayjs";
import { Injectable } from "@nestjs/common";
import { Between, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { INFLATION_PERIOD } from "src/application/enums";
import { IHistoryPriceRepository } from "src/domain/repositories";
import { EProductSource, HistoryPriceEntity, IHistoryPriceEntity, IProductEntity } from "src/domain/entites";

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

  async findPricesByDate(type: INFLATION_PERIOD, source?: EProductSource): Promise<IHistoryPriceEntity[]> {
    let start: Date;
    let end: Date;

    if (type === INFLATION_PERIOD.TODAY) {
      start = dayjs().startOf("day").toDate();
      end = dayjs().endOf("day").toDate();
    } else if (type === INFLATION_PERIOD.YESTERDAY) {
      start = dayjs().subtract(1, "day").startOf("day").toDate();
      end = dayjs().subtract(1, "day").endOf("day").toDate();
    } else if (type === INFLATION_PERIOD.LAST_WEEK) {
      start = dayjs().subtract(1, "week").startOf("day").toDate();
      end = dayjs().subtract(1, "week").endOf("day").toDate();
    } else if (type === INFLATION_PERIOD.LAST_MONTH) {
      start = dayjs().subtract(1, "month").startOf("day").toDate();
      end = dayjs().subtract(1, "month").endOf("day").toDate();
    }

    let query = { created_at: Between(start, end) };

    if (source) query["source"] = source;

    return await this.historyPriceModel.find({ where: query, relations: ["product"] });
  }
}
