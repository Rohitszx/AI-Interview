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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const resume_service_1 = require("./resume.service");
const multer = require("multer");
const resumeStore = new Map();
let ResumeController = class ResumeController {
    resumeService;
    constructor(resumeService) {
        this.resumeService = resumeService;
    }
    static getResumeTextById(id) {
        return resumeStore.get(id);
    }
    async uploadResume(file) {
        if (!file) {
            console.error('[Resume Upload] No file received. The field name must be "file" and sent as multipart/form-data.');
            throw new common_1.BadRequestException('No file uploaded. Field name must be "file".');
        }
        const text = await this.resumeService.extractText(file.buffer, file.originalname);
        const id = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        resumeStore.set(id, text);
        return { id, text };
    }
};
exports.ResumeController = ResumeController;
__decorate([
    (0, common_1.Post)("upload"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: Object }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof multer !== "undefined" && multer.File) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "uploadResume", null);
exports.ResumeController = ResumeController = __decorate([
    (0, swagger_1.ApiTags)("Resume"),
    (0, common_1.Controller)("resume"),
    __metadata("design:paramtypes", [resume_service_1.ResumeService])
], ResumeController);
//# sourceMappingURL=resume.controller.js.map