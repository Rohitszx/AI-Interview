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
exports.InterviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const interview_service_1 = require("./interview.service");
const start_interview_dto_1 = require("./dto/start-interview.dto");
const answer_dto_1 = require("./dto/answer.dto");
const finish_interview_dto_1 = require("./dto/finish-interview.dto");
let InterviewController = class InterviewController {
    interviewService;
    constructor(interviewService) {
        this.interviewService = interviewService;
    }
    async startInterview(dto) {
        return this.interviewService.startInterview(dto.resumeText, dto.jobDescription);
    }
    async answer(dto) {
        return this.interviewService.submitAnswer(dto.interviewContext, dto.answer);
    }
    async finish(dto) {
        return this.interviewService.finishInterview(dto.interviewContext);
    }
};
exports.InterviewController = InterviewController;
__decorate([
    (0, common_1.Post)("start"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_interview_dto_1.StartInterviewDto]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "startInterview", null);
__decorate([
    (0, common_1.Post)("answer"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [answer_dto_1.AnswerDto]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "answer", null);
__decorate([
    (0, common_1.Post)("finish"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [finish_interview_dto_1.FinishInterviewDto]),
    __metadata("design:returntype", Promise)
], InterviewController.prototype, "finish", null);
exports.InterviewController = InterviewController = __decorate([
    (0, swagger_1.ApiTags)("Interview"),
    (0, common_1.Controller)("interview"),
    __metadata("design:paramtypes", [interview_service_1.InterviewService])
], InterviewController);
//# sourceMappingURL=interview.controller.js.map