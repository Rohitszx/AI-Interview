import { IsString, IsObject } from "class-validator";

export class AnswerDto {
  @IsObject()
  interviewContext: any;

  @IsString()
  answer: string;
}
