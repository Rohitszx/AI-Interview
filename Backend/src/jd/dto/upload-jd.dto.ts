import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadJdDto {
  @ApiProperty({ type: "string", format: "binary" })
  @IsNotEmpty()
  file: any;
}
