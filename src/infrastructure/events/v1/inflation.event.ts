import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";

import { CalculateInflationV1 } from "src/application/use-cases";

@Injectable()
export class InflationEventListenerV1 {
  private readonly logger = new Logger(InflationEventListenerV1.name);

  constructor(private readonly calculateInflationUseCase: CalculateInflationV1) {}

  @OnEvent("inflation.daily", { async: true })
  async handleInflationDailyEvent(payload: any) {
    this.logger.log("Handling inflation.daily event");

    await this.calculateInflationUseCase.exec();
  }
}
