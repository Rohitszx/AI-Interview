import { IsOptional, IsString, IsArray, IsInt, Min } from "class-validator";

export class GenerateQuestionDto {
  @IsOptional()
  @IsString()
  resumeText?: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousQuestions?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousAnswers?: string[];

  @IsInt()
  @Min(1)
  count: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  isFinished?: boolean;
}
