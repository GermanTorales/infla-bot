import { EPriceSource, IProductEntity } from "src/domain/entites";

export class DataScrapedDtoV1 {
  name: string;
  price: string;
  image: string;
}

export class ProductScrapDtoV1 {
  id: string;
  name: string;
  price: number;
  stringPrice: string;
  source: EPriceSource;
  image: string;
}

export class SourceProductDtoV1 {
  id: string;
  price: number;
  source: EPriceSource;
  stringPrice: string;
  image?: string;
}
