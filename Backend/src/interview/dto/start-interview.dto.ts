import { IsString } from "class-validator";

export class StartInterviewDto {
  @IsString()
  resumeText: string;

  @IsString()
  jobDescription: string;
}
