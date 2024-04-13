import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import BaseModel from "./base.entity";
import { IProductEntity, ProductEntity } from "./product.entity";

export interface IHistoryPriceEntity {
  price: number;
  date: Date;
  source: EPriceSource;
  product: IProductEntity;
}

export enum EPriceSource {
  COTO = "coto",
  CARREFOUR = "carrefour",
  DIA = "dia",
  NA = "n/a",
}

@Entity({ name: "history_prices" })
export class HistoryPriceEntity extends BaseModel implements IHistoryPriceEntity {
  @Column({ type: "float", nullable: false })
  price: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column({ type: "enum", enum: EPriceSource, default: EPriceSource.NA, nullable: false })
  source: EPriceSource;

  @ManyToOne(() => ProductEntity, product => product.prices)
  @JoinColumn({ name: "product" })
  product: IProductEntity;
}
