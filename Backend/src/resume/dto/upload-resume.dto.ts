import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadResumeDto {
  @ApiProperty({ type: "string", format: "binary" })
  @IsNotEmpty()
  file: any;
}
