import { Column, Entity } from "typeorm";

import BaseModel from "./base.entity";
import { EProductSource } from "./product.entity";

export interface IHistoryInflationEntity {
  inflation: number;
  date: Date;
  source: EProductSource;
}

@Entity({ name: "history_inflations" })
export class HistoryInflationEntity extends BaseModel implements IHistoryInflationEntity {
  @Column({ type: "float", nullable: false })
  inflation: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column({ type: "enum", enum: EProductSource, default: EProductSource.NA, nullable: false })
  source: EProductSource;
}
