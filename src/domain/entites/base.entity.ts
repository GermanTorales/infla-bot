import { Exclude, instanceToInstance } from "class-transformer";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export default abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  toJSON() {
    return instanceToInstance(this);
  }
}
