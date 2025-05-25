import { AiService } from "../ai/ai.service";
import { Repository } from "typeorm";
import { InterviewSession } from "./interview-session.entity";
export declare class InterviewService {
    private readonly aiService;
    private readonly interviewSessionRepository;
    constructor(aiService: AiService, interviewSessionRepository: Repository<InterviewSession>);
    startInterview(resumeText: string, jobDescription: string): Promise<{
        question: string;
        interviewContext: {
            resumeText: string;
            jobDescription: string;
            previousQuestions: string[];
            previousAnswers: string[];
            count: number;
        };
    }>;
    submitAnswer(interviewContext: any, answer: string): Promise<{
        question: string;
        finished: boolean;
        interviewContext: any;
    }>;
    finishInterview(interviewContext: any): Promise<{
        feedback: any;
    }>;
}
