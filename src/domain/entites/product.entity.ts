import { Column, Entity, OneToMany } from "typeorm";

import BaseModel from "./base.entity";
import { HistoryPriceEntity, IHistoryPriceEntity } from "./history-prices.entity";

export interface IProductEntity {
  id?: string;
  name: string;
  coto_url?: string;
  carrefour_url?: string;
  dia_url?: string;
  last_price: number;
  created_at?: Date;
  updated_at: Date;
  prices?: IHistoryPriceEntity[];
  status: EProductStatus;
}

export enum EProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

export enum EProductSource {
  COTO = "coto",
  CARREFOUR = "carrefour",
  DIA = "dia",
  NA = "n/a",
}

@Entity({ name: "products" })
export class ProductEntity extends BaseModel implements IProductEntity {
  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: true, default: null })
  coto_url?: string;

  @Column({ type: "varchar", nullable: true, default: null })
  carrefour_url?: string;

  @Column({ type: "varchar", nullable: true, default: null })
  dia_url?: string;

  @Column({ type: "float", nullable: true, default: null })
  last_price: number;

  @OneToMany(() => HistoryPriceEntity, historyEntity => historyEntity.product)
  prices?: IHistoryPriceEntity[];

  @Column({ type: "enum", enum: EProductStatus, default: EProductStatus.ACTIVE })
  status: EProductStatus;
}
