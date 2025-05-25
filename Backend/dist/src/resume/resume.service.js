"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResumeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeService = void 0;
const common_1 = require("@nestjs/common");
let ResumeService = ResumeService_1 = class ResumeService {
    logger = new common_1.Logger(ResumeService_1.name);
    async extractText(fileBuffer, fileName) {
        this.logger.log(`Extracting text from resume: ${fileName}`);
        const ext = fileName.split(".").pop()?.toLowerCase();
        try {
            if (ext === "pdf") {
                const pdfParse = await Promise.resolve().then(() => require("pdf-parse"));
                const data = await (pdfParse.default || pdfParse)(fileBuffer);
                return data.text.trim();
            }
            else if (ext === "docx") {
                const mammoth = await Promise.resolve().then(() => require("mammoth"));
                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                return result.value.trim();
            }
            else {
                throw new Error("Unsupported file type. Only PDF and DOCX are supported.");
            }
        }
        catch (error) {
            this.logger.error(`Failed to extract text from ${fileName}:`, error);
            throw new Error("Failed to extract text from resume. Please upload a valid PDF or DOCX file.");
        }
    }
};
exports.ResumeService = ResumeService;
exports.ResumeService = ResumeService = ResumeService_1 = __decorate([
    (0, common_1.Injectable)()
], ResumeService);
//# sourceMappingURL=resume.service.js.map