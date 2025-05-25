import { AiService } from "./ai.service";
import { GenerateQuestionDto } from "./dto/generate-question.dto";
import { GenerateFeedbackDto } from "./dto/generate-feedback.dto";
import { AnalyzeTranscriptDto } from "./dto/analyze-transcript.dto";
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateQuestion(dto: GenerateQuestionDto): Promise<{
        question: string;
    }>;
    generateFeedback(dto: GenerateFeedbackDto): Promise<any>;
    analyzeTranscript(dto: AnalyzeTranscriptDto): Promise<any>;
}
