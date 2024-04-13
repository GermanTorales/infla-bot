import { EPriceSource, IProductEntity } from "src/domain/entites";

export class ProductScrapDtoV1 {
  id: string;
  name: string;
  price: number;
  stringPrice: string;
  source: EPriceSource;
  product: IProductEntity;
}

export class SourceProductDtoV1 {
  product: IProductEntity;
  price: number;
  source: EPriceSource;
  stringPrice: string;
}
