import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { IProductRepository } from "src/domain/repositories";
import { EProductSource, IProductEntity, ProductEntity } from "src/domain/entites";

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(@InjectRepository(ProductEntity) private readonly productModel: Repository<ProductEntity>) {}

  async create(product: IProductEntity): Promise<IProductEntity> {
    return await this.productModel.save(this.productModel.create(product));
  }

  async findAll(): Promise<IProductEntity[]> {
    return await this.productModel.find();
  }

  async findBy(filters: FindOptionsWhere<IProductEntity>): Promise<IProductEntity[]> {
    return this.productModel.find({ where: filters });
  }

  async findOne(filters: FindOptionsWhere<IProductEntity>): Promise<IProductEntity> {
    return this.productModel.findOne({ where: filters, relations: ["prices"] });
  }

  async update(id: string, data: QueryDeepPartialEntity<IProductEntity>): Promise<void> {
    await this.productModel.update(id, data);
  }

  async deleteBy(filters: FindOptionsWhere<IProductEntity>): Promise<void> {
    await this.productModel.delete(filters);
  }

  async deleteOne(id: string): Promise<void> {
    await this.productModel.delete(id);
  }

  async findBySource(source: EProductSource): Promise<IProductEntity[]> {
    let query: string = "";

    if (source === EProductSource.COTO) query += `p.coto_url IS NOT NULL AND p.coto_url != :empty`;
    else if (source === EProductSource.CARREFOUR) query += `p.carrefour_url IS NOT NULL AND p.carrefour_url != :empty`;
    else if (source === EProductSource.DIA) query += `p.dia_url IS NOT NULL AND p.dia_url != :empty`;

    return await this.productModel.createQueryBuilder("p").where(query, { empty: "" }).getMany();
  }

  async findOneById(id): Promise<IProductEntity> {
    const query = { id };

    return this.findOne(query);
  }

  async findAllWithPrices(): Promise<IProductEntity[]> {
    return await this.productModel.find({ relations: ["prices"] });
  }

  async count(): Promise<number> {
    return await this.productModel.count();
  }
}
