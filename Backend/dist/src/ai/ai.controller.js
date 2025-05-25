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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_service_1 = require("./ai.service");
const generate_question_dto_1 = require("./dto/generate-question.dto");
const generate_feedback_dto_1 = require("./dto/generate-feedback.dto");
const analyze_transcript_dto_1 = require("./dto/analyze-transcript.dto");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateQuestion(dto) {
        const question = await this.aiService.generateQuestion(dto);
        return { question };
    }
    async generateFeedback(dto) {
        return this.aiService.generateFeedback(dto);
    }
    async analyzeTranscript(dto) {
        return this.aiService.analyzeTranscript(dto.transcript);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)("question"),
    (0, swagger_1.ApiOperation)({ summary: "Generate interview question(s)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Generated question", type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_question_dto_1.GenerateQuestionDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateQuestion", null);
__decorate([
    (0, common_1.Post)("feedback"),
    (0, swagger_1.ApiOperation)({ summary: "Generate feedback for an interview transcript" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Generated feedback", type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_feedback_dto_1.GenerateFeedbackDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateFeedback", null);
__decorate([
    (0, common_1.Post)("analyze"),
    (0, swagger_1.ApiOperation)({ summary: "Analyze an interview transcript" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Analysis result", type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analyze_transcript_dto_1.AnalyzeTranscriptDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "analyzeTranscript", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)("AI"),
    (0, common_1.Controller)("ai"),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map