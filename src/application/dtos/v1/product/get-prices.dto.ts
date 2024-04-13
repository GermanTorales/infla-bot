import { IsEnum } from "class-validator";
import { EProductSource } from "src/domain/entites";

export class GetPricesParams {
  @IsEnum(EProductSource)
  source: EProductSource;
}
