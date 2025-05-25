import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InterviewService } from "./interview.service";
import { StartInterviewDto } from "./dto/start-interview.dto";
import { AnswerDto } from "./dto/answer.dto";
import { FinishInterviewDto } from "./dto/finish-interview.dto";

@ApiTags("Interview")
@Controller("interview")
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post("start")
  async startInterview(@Body() dto: StartInterviewDto) {
    return this.interviewService.startInterview(
      dto.resumeText,
      dto.jobDescription,
    );
  }

  @Post("answer")
  async answer(@Body() dto: AnswerDto) {
    return this.interviewService.submitAnswer(dto.interviewContext, dto.answer);
  }

  @Post("finish")
  async finish(@Body() dto: FinishInterviewDto) {
    return this.interviewService.finishInterview(dto.interviewContext);
  }
}
