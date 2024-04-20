import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";

import { PriceChartV1 } from "src/application/use-cases";

@Controller({ path: "charts", version: "1" })
export class ChartControllerV1 {
  constructor(private readonly priceChartUseCase: PriceChartV1) {}

  @Get("price/:id")
  @HttpCode(HttpStatus.OK)
  async getPriceChart(@Param("id") id: string) {
    return await this.priceChartUseCase.exec(id);
  }
}
