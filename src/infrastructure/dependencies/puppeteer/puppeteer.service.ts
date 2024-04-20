import * as puppeteer from "puppeteer";
import { Injectable, Logger } from "@nestjs/common";

import { EPriceSource, EProductSource } from "src/domain/entites";
import { cleanPrice, cleanText } from "src/application/utils";
import { DataScrapedDtoV1, ProductScrapDtoV1 } from "src/application/dtos";

@Injectable()
export class Puppeteer {
  private browser: puppeteer.Browser;
  private logger: Logger = new Logger(Puppeteer.name);

  constructor() {}

  async initBrowser() {
    this.browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      headless: true,
    });
  }

  async scrap(data: { url: string; id: string; source: EProductSource }, fnEvaluate): Promise<ProductScrapDtoV1> {
    const { url, id, source } = data;
    let page;

    try {
      page = await this.browser.newPage();

      await page.goto(url, { timeout: 60000, waitUntil: "networkidle2" });

      const productInfo: DataScrapedDtoV1 = await page.evaluate(fnEvaluate);

      const client = await page.target().createCDPSession();
      await client.send("Network.clearBrowserCookies");
      await client.send("Network.clearBrowserCache");

      return {
        id,
        name: cleanText(productInfo.name),
        price: cleanPrice(productInfo.price),
        stringPrice: cleanText(productInfo.price),
        source: EPriceSource[source.toUpperCase()],
        image: productInfo.image,
      };
    } catch (error) {
      this.logger.error(`Error scraping ${source} ${id}: ${error}`);

      return null;
    } finally {
      if (page) await page.close();
    }
  }

  async closeBrowser() {
    await this.browser.close();
  }
}
