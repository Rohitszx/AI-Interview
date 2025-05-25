import { Injectable } from "@nestjs/common";
import { AiService } from "../ai/ai.service";

import { Repository } from "typeorm";
import { InterviewSession } from "./interview-session.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class InterviewService {
  constructor(
    private readonly aiService: AiService,
    @InjectRepository(InterviewSession)
    private readonly interviewSessionRepository: Repository<InterviewSession>,
  ) {}

  async startInterview(resumeText: string, jobDescription: string) {
    const context: {
      resumeText: string;
      jobDescription: string;
      previousQuestions: string[];
      previousAnswers: string[];
      count: number;
    } = {
      resumeText,
      jobDescription,
      previousQuestions: [],
      previousAnswers: [],
      count: 1,
    };
    const question = await this.aiService.generateQuestion(context);
    context.previousQuestions.push(question);
    return { question, interviewContext: context };
  }

  async submitAnswer(interviewContext: any, answer: string) {
    (interviewContext.previousAnswers as string[]).push(answer);
    interviewContext.count++;
    const question = await this.aiService.generateQuestion(interviewContext);
    (interviewContext.previousQuestions as string[]).push(question);
    return { question, finished: false, interviewContext };
  }

  async finishInterview(interviewContext: any) {
    const feedback = await this.aiService.generateFeedback({
      transcript: interviewContext.previousAnswers.join("\n"),
      jobDescription: interviewContext.jobDescription,
      resumeContent: interviewContext.resumeText,
    });

    const userInfo = await this.aiService.extractUserInfoFromResume(
      interviewContext.resumeText,
    );

    if (this.interviewSessionRepository) {
      await this.interviewSessionRepository.save({
        userInfo,
        transcript: interviewContext.previousAnswers.join("\n"),
        feedback,
      });
    }

    return { feedback };
  }
}
