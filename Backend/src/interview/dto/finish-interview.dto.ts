import { IsObject } from "class-validator";

export class FinishInterviewDto {
  @IsObject()
  interviewContext: any;
}
