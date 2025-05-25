import { InterviewService } from "./interview.service";
import { StartInterviewDto } from "./dto/start-interview.dto";
import { AnswerDto } from "./dto/answer.dto";
import { FinishInterviewDto } from "./dto/finish-interview.dto";
export declare class InterviewController {
    private readonly interviewService;
    constructor(interviewService: InterviewService);
    startInterview(dto: StartInterviewDto): Promise<{
        question: string;
        interviewContext: {
            resumeText: string;
            jobDescription: string;
            previousQuestions: string[];
            previousAnswers: string[];
            count: number;
        };
    }>;
    answer(dto: AnswerDto): Promise<{
        question: string;
        finished: boolean;
        interviewContext: any;
    }>;
    finish(dto: FinishInterviewDto): Promise<{
        feedback: any;
    }>;
}
