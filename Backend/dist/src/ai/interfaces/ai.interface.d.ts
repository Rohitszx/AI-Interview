export interface IAiService {
    generateQuestion(context: {
        resumeText?: string;
        jobDescription?: string;
        previousQuestions?: string[];
        previousAnswers?: string[];
        count: number;
        startTime?: string;
        isFinished?: boolean;
    }): Promise<string>;
    generateInterviewQuestions(jobDescription: string, resumeContent: string, previousQuestion?: string, previousAnswer?: string): Promise<string[]>;
    analyzeTranscript(transcript: string): Promise<{
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
    }>;
    generateFeedback(params: {
        transcript: string;
        jobDescription: string;
        resumeContent?: string;
    }): Promise<any>;
}
