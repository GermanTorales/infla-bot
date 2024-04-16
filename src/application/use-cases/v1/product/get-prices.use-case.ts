import { map } from "async";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { cleanPrice, cleanText } from "src/application/utils";
import { PuppeteerService } from "src/infrastructure/dependencies";
import { ProductScrapDtoV1, SourceProductDtoV1 } from "src/application/dtos";
import { IHistoryPriceRepository, IProductRepository } from "src/domain/repositories";
import { EProductSource, IHistoryPriceEntity, IProductEntity } from "src/domain/entites";

@Injectable()
export class GetPricesV1 {
  private logger: Logger = new Logger(GetPricesV1.name);

  constructor(
    @Inject(PORT.Product) private readonly productRepository: IProductRepository,
    @Inject(PORT.HistoryPrice) private readonly historyPriceRepository: IHistoryPriceRepository,
    private readonly puppeteerService: PuppeteerService,
  ) {}

  async exec(source: EProductSource) {
    const productsList: IProductEntity[] = await this.productRepository.findBySource(source);

    const evaluateBySource = {
      coto: this.cotoScrap,
      carrefour: this.carrefourScrap,
      dia: this.diaScrap,
    };

    const dataScraped: ProductScrapDtoV1[] = await map(productsList, async (product: IProductEntity) => {
      const url: string = product[`${source}_url`];

      return await this.puppeteerService.scrap({ id: product.id, url, source }, evaluateBySource[source]);
    });

    const dataClened = dataScraped
      .filter(e => e)
      .map((d: ProductScrapDtoV1): SourceProductDtoV1 => {
        const formatedData = Object.entries(d).reduce((acc, [key, value]) => {
          if (key === "price") acc[key] = cleanPrice(value);
          else acc[key] = cleanText(value);

          return acc;
        }, {} as ProductScrapDtoV1);

        const product: IProductEntity = productsList.find(p => p.id === d.id);

        return { product, source: d.source, price: formatedData.price, stringPrice: formatedData.stringPrice };
      });

    await this._saveInDb(dataClened);

    return dataClened.map(p => ({ source: p.source, price: p.price, name: p.product.name, stringPrice: p.stringPrice, id: p.product.id }));
  }

  private async _saveInDb(sourceProducts: SourceProductDtoV1[]) {
    await map(sourceProducts, async (sProduct: SourceProductDtoV1) => {
      const newHistoryPrice: IHistoryPriceEntity = {
        price: sProduct.price,
        date: new Date(),
        source: sProduct.source,
        product: sProduct.product,
      };

      return await this.historyPriceRepository.savePrice(newHistoryPrice);
    });
  }

  cotoScrap() {
    const name = document.querySelector(".product_page")?.textContent;
    const price = document.querySelector(".atg_store_newPrice")?.textContent;

    return { name, price, stringPrice: price };
  }

  carrefourScrap() {
    const name = document.querySelector(".vtex-store-components-3-x-productBrand")?.textContent;
    const listPrice = document.querySelector(".valtech-carrefourar-product-price-0-x-listPrice")?.textContent;
    const sellingPrice = document.querySelector(".valtech-carrefourar-product-price-0-x-sellingPrice")?.textContent;

    const price = listPrice || sellingPrice || "$0";

    return { name, price, stringPrice: price };
  }

  async diaScrap() {
    const name = document.querySelector(".vtex-store-components-3-x-productBrand")?.textContent;
    const price = document.querySelector(".vtex-product-price-1-x-currencyContainer")?.textContent;

    return { name, price, stringPrice: price };
  }
}
