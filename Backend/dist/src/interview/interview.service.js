"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai/ai.service");
const typeorm_1 = require("typeorm");
const interview_session_entity_1 = require("./interview-session.entity");
const typeorm_2 = require("@nestjs/typeorm");
let InterviewService = class InterviewService {
    aiService;
    interviewSessionRepository;
    constructor(aiService, interviewSessionRepository) {
        this.aiService = aiService;
        this.interviewSessionRepository = interviewSessionRepository;
    }
    async startInterview(resumeText, jobDescription) {
        const context = {
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
    async submitAnswer(interviewContext, answer) {
        interviewContext.previousAnswers.push(answer);
        interviewContext.count++;
        const question = await this.aiService.generateQuestion(interviewContext);
        interviewContext.previousQuestions.push(question);
        return { question, finished: false, interviewContext };
    }
    async finishInterview(interviewContext) {
        const feedback = await this.aiService.generateFeedback({
            transcript: interviewContext.previousAnswers.join("\n"),
            jobDescription: interviewContext.jobDescription,
            resumeContent: interviewContext.resumeText,
        });
        const userInfo = await this.aiService.extractUserInfoFromResume(interviewContext.resumeText);
        if (this.interviewSessionRepository) {
            await this.interviewSessionRepository.save({
                userInfo,
                transcript: interviewContext.previousAnswers.join("\n"),
                feedback,
            });
        }
        return { feedback };
    }
};
exports.InterviewService = InterviewService;
exports.InterviewService = InterviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(interview_session_entity_1.InterviewSession)),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        typeorm_1.Repository])
], InterviewService);
//# sourceMappingURL=interview.service.js.map