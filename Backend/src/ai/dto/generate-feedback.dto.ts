import { IsString, IsOptional } from "class-validator";

export class GenerateFeedbackDto {
  @IsString()
  transcript: string;

  @IsString()
  jobDescription: string;

  @IsOptional()
  @IsString()
  resumeContent?: string;
}
