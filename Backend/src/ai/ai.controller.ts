import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { GenerateQuestionDto } from "./dto/generate-question.dto";
import { GenerateFeedbackDto } from "./dto/generate-feedback.dto";
import { AnalyzeTranscriptDto } from "./dto/analyze-transcript.dto";

@ApiTags("AI")
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("question")
  @ApiOperation({ summary: "Generate interview question(s)" })
  @ApiResponse({ status: 200, description: "Generated question", type: String })
  async generateQuestion(
    @Body() dto: GenerateQuestionDto,
  ): Promise<{ question: string }> {
    const question = await this.aiService.generateQuestion(dto);
    return { question };
  }

  @Post("feedback")
  @ApiOperation({ summary: "Generate feedback for an interview transcript" })
  @ApiResponse({ status: 200, description: "Generated feedback", type: Object })
  async generateFeedback(@Body() dto: GenerateFeedbackDto): Promise<any> {
    return this.aiService.generateFeedback(dto);
  }

  @Post("analyze")
  @ApiOperation({ summary: "Analyze an interview transcript" })
  @ApiResponse({ status: 200, description: "Analysis result", type: Object })
  async analyzeTranscript(@Body() dto: AnalyzeTranscriptDto): Promise<any> {
    return this.aiService.analyzeTranscript(dto.transcript);
  }
}
