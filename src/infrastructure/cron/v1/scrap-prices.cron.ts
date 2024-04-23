import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetPricesV1 } from "src/application/use-cases";
import { EProductSource } from "src/domain/entites";

@Injectable()
export class ScrapPricesCronV1 {
  private readonly logger: Logger = new Logger(ScrapPricesCronV1.name);

  constructor(private readonly getPricesUseCase: GetPricesV1) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM, { name: "coto", timeZone: "America/Argentina/Buenos_Aires" })
  async handleGetCotoPrices() {
    this.logger.log("Getting Coto prices");

    await this.getPricesUseCase.exec(EProductSource.COTO);
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM, { name: "carrefour", timeZone: "America/Argentina/Buenos_Aires" })
  async handleGetCarrefourPrices() {
    this.logger.log("Getting Carrefour prices");

    await this.getPricesUseCase.exec(EProductSource.CARREFOUR);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: "dia", timeZone: "America/Argentina/Buenos_Aires" })
  async handleGetDiaPrices() {
    this.logger.log("Getting Dia prices");

    await this.getPricesUseCase.exec(EProductSource.DIA);
  }
}
