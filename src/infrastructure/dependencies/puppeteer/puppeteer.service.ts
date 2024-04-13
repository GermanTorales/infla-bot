import * as puppeteer from "puppeteer";
import { Injectable, Logger } from "@nestjs/common";

import { ProductScrapDtoV1 } from "src/application/dtos";

@Injectable()
export class PuppeteerService {
  private logger: Logger = new Logger(PuppeteerService.name);

  constructor() {}

  async scrap(data, fnEvaluate): Promise<ProductScrapDtoV1> {
    const { url, id, source } = data;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { timeout: 60000 });

    const productInfo = await page.evaluate(fnEvaluate);

    await browser.close();

    return { ...productInfo, id, source };
  }
}
