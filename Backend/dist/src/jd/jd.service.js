"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JdService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JdService = void 0;
const common_1 = require("@nestjs/common");
let JdService = JdService_1 = class JdService {
    logger = new common_1.Logger(JdService_1.name);
    async extractText(fileBuffer, fileName) {
        this.logger.log(`Extracting text from JD: ${fileName}`);
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
            this.logger.error(`Failed to extract text from JD ${fileName}:`, error);
            throw new Error("Failed to extract text from JD. Please upload a valid PDF or DOCX file.");
        }
    }
};
exports.JdService = JdService;
exports.JdService = JdService = JdService_1 = __decorate([
    (0, common_1.Injectable)()
], JdService);
//# sourceMappingURL=jd.service.js.map