import { map } from "async";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { Puppeteer } from "src/infrastructure/dependencies";
import { DataScrapedDtoV1, ProductScrapDtoV1, SourceProductDtoV1 } from "src/application/dtos";
import { IHistoryPriceRepository, IProductRepository } from "src/domain/repositories";
import { EProductSource, IHistoryPriceEntity, IProductEntity } from "src/domain/entites";
import * as dayjs from "dayjs";

@Injectable()
export class GetPricesV1 {
  private puppeteer: Puppeteer;
  private logger: Logger = new Logger(GetPricesV1.name);

  constructor(
    @Inject(PORT.Product) private readonly productRepository: IProductRepository,
    @Inject(PORT.HistoryPrice) private readonly historyPriceRepository: IHistoryPriceRepository,
  ) {
    this.puppeteer = new Puppeteer();
  }

  async exec(source: EProductSource) {
    const productsList: IProductEntity[] = await this.productRepository.findBySource(source);

    const evaluateBySource = {
      coto: this.cotoScrap,
      carrefour: this.carrefourScrap,
      dia: this.diaScrap,
    };

    let dataScraped: ProductScrapDtoV1[] = [];

    await this.puppeteer.initBrowser();

    const startTime = new Date().getTime();

    for (const product of productsList) {
      const url: string = product[`${source}_url`];
      const scrapedData = await this.puppeteer.scrap({ id: product.id, url, source }, evaluateBySource[source]);

      if (scrapedData) dataScraped.push(scrapedData);
    }

    const totalTime = dayjs().diff(startTime, "minute");

    this.logger.log(`Scraped ${dataScraped.length} products in ${totalTime}m`);

    await this.puppeteer.closeBrowser();
    await this._saveInDb(dataScraped, productsList);
    await this._checkImage(dataScraped, productsList);

    return dataScraped;
  }

  private async _saveInDb(sourceProducts: ProductScrapDtoV1[], products: IProductEntity[]): Promise<IHistoryPriceEntity[]> {
    return await map(sourceProducts, async (sProduct: SourceProductDtoV1) => {
      const product: IProductEntity = products.find(p => p.id === sProduct.id);

      const newHistoryPrice: IHistoryPriceEntity = {
        price: sProduct.price,
        date: new Date(),
        source: sProduct.source,
        product,
      };

      return await this.historyPriceRepository.savePrice(newHistoryPrice);
    });
  }

  private async _checkImage(dataScraped: ProductScrapDtoV1[], products: IProductEntity[]) {
    await map(dataScraped, async (data: ProductScrapDtoV1) => {
      const product: IProductEntity = products.find(p => p.id === data.id);

      if (product?.image?.length) return;

      product.image = product.image;

      await this.productRepository.update(product.id, product);
    });
  }

  cotoScrap(): DataScrapedDtoV1 {
    const name = document.querySelector(".product_page")?.textContent;
    const regularPrice = document.querySelector(".price_regular_precio")?.textContent;
    const onlyPrice = document.querySelector(".atg_store_newPrice")?.textContent;
    const image = document.querySelector(".zoomImg")?.getAttribute("src");

    const price = regularPrice || onlyPrice || "$0";

    return { name, price, image };
  }

  carrefourScrap(): DataScrapedDtoV1 {
    const name = document.querySelector(".vtex-store-components-3-x-productBrand")?.textContent;
    const listPrice = document.querySelector(".valtech-carrefourar-product-price-0-x-listPrice")?.textContent;
    const sellingPrice = document.querySelector(".valtech-carrefourar-product-price-0-x-sellingPrice")?.textContent;
    const image = document.querySelector(".vtex-store-components-3-x-productImageTag")?.getAttribute("src");

    const price = listPrice || sellingPrice || "$0";

    return { name, price, image };
  }

  diaScrap(): DataScrapedDtoV1 {
    const name = document.querySelector(".vtex-store-components-3-x-productBrand")?.textContent;
    const price = document.querySelector(".vtex-product-price-1-x-currencyContainer")?.textContent;
    const image = document.querySelector(".vtex-store-components-3-x-productImageTag")?.getAttribute("src");

    return { name, price, image };
  }
}
