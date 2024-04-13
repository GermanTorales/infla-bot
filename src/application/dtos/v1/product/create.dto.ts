import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDtoV1 {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  coto_url: string;

  @IsString()
  carrefour_url: string;

  @IsString()
  dia_url: string;
}
