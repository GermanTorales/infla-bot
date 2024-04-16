import * as puppeteer from "puppeteer";
import { Injectable, Logger } from "@nestjs/common";

import { ProductScrapDtoV1 } from "src/application/dtos";
import { cleanPrice, cleanText } from "src/application/utils";

@Injectable()
export class PuppeteerService {
  private logger: Logger = new Logger(PuppeteerService.name);

  constructor() {}

  async scrap(data, fnEvaluate): Promise<ProductScrapDtoV1> {
    const { url, id, source } = data;
    let browser;

    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url, { timeout: 120000, waitUntil: "domcontentloaded" });

      const productInfo = await page.evaluate(fnEvaluate);

      this.logger.log(`Scraped: ${cleanText(productInfo.name)} - ${cleanPrice(productInfo.price)}`);

      return { ...productInfo, id, source };
    } catch (error) {
      this.logger.error(`Error scraping ${source} ${id}: ${error}`);

      return null;
    } finally {
      if (browser) await browser.close();
    }
  }
}
