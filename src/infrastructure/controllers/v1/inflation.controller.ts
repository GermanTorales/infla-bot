import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";

import { EProductSource } from "src/domain/entites";
import { CurrentInflationV1, GeneralV1 } from "src/application/use-cases";

@Controller({ path: "inflations", version: "1" })
export class InflationControllerV1 {
  constructor(
    private readonly generalUseCase: GeneralV1,
    private readonly currentInflationV1: CurrentInflationV1,
  ) {}

  @Get("general")
  @HttpCode(HttpStatus.OK)
  async getGeneral() {
    return await this.generalUseCase.exec();
  }

  @Get("daily/:source")
  @HttpCode(HttpStatus.OK)
  async getCurrentCotoInfation(@Param("source") source: EProductSource) {
    return await this.currentInflationV1.exec();
  }
}
