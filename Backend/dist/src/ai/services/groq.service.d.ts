import { ConfigService } from "@nestjs/config";
export declare class GroqService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    private readonly defaultModel;
    constructor(configService: ConfigService);
    generateCompletion(messages: Array<{
        role: string;
        content: string;
    }>, model?: string, temperature?: number, maxTokens?: number): Promise<string>;
    generateInterviewQuestions(jobDescription: string, resumeContent: string, previousQuestion?: string, previousAnswer?: string, aiPrompt?: string): Promise<string[]>;
    analyzeTranscript(transcript: string): Promise<any>;
    generateFeedback(transcript: string, jobDescription: string, resumeContent?: string): Promise<any>;
}
