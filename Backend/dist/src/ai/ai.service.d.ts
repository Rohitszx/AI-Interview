import { ConfigService } from "@nestjs/config";
import { IAiService } from "./interfaces/ai.interface";
import { GroqService } from "./services/groq.service";
export declare class AiService implements IAiService {
    private readonly groqService;
    private readonly configService;
    private readonly logger;
    constructor(groqService: GroqService, configService: ConfigService);
    extractUserInfoFromResume(resumeText: string): Promise<{
        name?: string;
        email?: string;
        phone?: string;
        skills?: string[];
        experience?: string;
        education?: string;
        [key: string]: any;
    }>;
    private static readonly MIN_QUESTIONS;
    private static readonly MAX_QUESTIONS;
    generateQuestion(context: {
        resumeText?: string;
        jobDescription?: string;
        previousQuestions?: string[];
        previousAnswers?: string[];
        count: number;
        startTime?: string;
        isFinished?: boolean;
    }): Promise<string>;
    analyzeTranscript(transcript: string): Promise<{
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
    }>;
    generateInterviewQuestions(jobDescription: string, resumeContent: string, previousQuestion?: string, previousAnswer?: string): Promise<string[]>;
    generateFeedback(params: {
        transcript: string;
        jobDescription: string;
        resumeContent?: string;
    }): Promise<any>;
}
