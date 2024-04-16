import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";

import { CalculateInflationV1, GeneralV1 } from "src/application/use-cases";

@Controller({ path: "inflations", version: "1" })
export class InflationControllerV1 {
  constructor(
    private readonly generalUseCase: GeneralV1,
    private readonly calculateInflationUseCase: CalculateInflationV1,
  ) {}

  @Get("general")
  @HttpCode(HttpStatus.OK)
  async getGeneral() {
    return await this.generalUseCase.exec();
  }

  @Get("period/daily")
  @HttpCode(HttpStatus.OK)
  async getInflation() {
    return await this.calculateInflationUseCase.exec();
  }
}
