import { FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { EProductSource, IProductEntity } from "src/domain/entites";

export interface IProductRepository {
  create: (product: IProductEntity) => Promise<IProductEntity>;
  findAll: () => Promise<IProductEntity[]>;
  findBy: (filters: FindOptionsWhere<IProductEntity>) => Promise<IProductEntity[]>;
  findOne: (filters: FindOptionsWhere<IProductEntity>) => Promise<IProductEntity>;
  findOneById: (id: string) => Promise<IProductEntity>;
  update: (id: string, data: QueryDeepPartialEntity<IProductEntity>) => Promise<void>;
  deleteBy: (filters: FindOptionsWhere<IProductEntity>) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  findBySource: (source: EProductSource) => Promise<IProductEntity[]>;
  findAllWithPrices: () => Promise<IProductEntity[]>;
  count: () => Promise<number>;
}
