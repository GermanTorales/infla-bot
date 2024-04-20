import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";

import { EProductSource } from "src/domain/entites";
import * as UseCases from "src/application/use-cases";

@Controller({ path: "inflations", version: "1" })
export class InflationControllerV1 {
  constructor(
    private readonly generalUseCase: UseCases.GeneralV1,
    private readonly calculateInflationUseCase: UseCases.CalculateInflationV1,
    private readonly dailySourceInflationUseCase: UseCases.DailySourceInflationV1,
  ) {}

  @Get("")
  @HttpCode(HttpStatus.OK)
  async getGeneral() {
    return await this.generalUseCase.exec();
  }

  @Get("period/daily")
  @HttpCode(HttpStatus.OK)
  async getInflation() {
    return await this.calculateInflationUseCase.exec();
  }

  @Get("source/:source/period/daily")
  @HttpCode(HttpStatus.OK)
  async getInflationBySource(@Param("source") source: EProductSource) {
    return await this.dailySourceInflationUseCase.exec(source);
  }
}
