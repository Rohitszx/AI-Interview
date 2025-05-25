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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_service_1 = require("./services/groq.service");
let AiService = class AiService {
    static { AiService_1 = this; }
    groqService;
    configService;
    logger = new common_1.Logger(AiService_1.name);
    constructor(groqService, configService) {
        this.groqService = groqService;
        this.configService = configService;
    }
    async extractUserInfoFromResume(resumeText) {
        try {
            const prompt = `Extract the following information from this resume:
      - Full Name
      - Email
      - Phone
      - List of skills (as array)
      - Total years of experience (as a string)
      - Highest education (as a string)

      RESUME:
      ${resumeText}

      Return the result as a JSON object with keys: name, email, phone, skills, experience, education.`;
            const messages = [{ role: "user", content: prompt }];
            const completion = await this.groqService.generateCompletion(messages);
            const sanitized = completion
                .replace(/```json[\s\n]*/gi, "")
                .replace(/```/g, "")
                .trim();
            const firstBrace = sanitized.indexOf("{");
            const lastBrace = sanitized.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                const jsonString = sanitized.substring(firstBrace, lastBrace + 1);
                try {
                    return JSON.parse(jsonString);
                }
                catch (jsonError) {
                    this.logger.error(`Error parsing extracted user info: ${jsonError.message}`);
                    return {
                        rawResponse: completion,
                        error: "Failed to parse structured user info",
                    };
                }
            }
            else {
                this.logger.error("Could not find valid JSON object in LLM output");
                return {
                    rawResponse: completion,
                    error: "No valid JSON object found in LLM output",
                };
            }
        }
        catch (error) {
            this.logger.error(`Failed to extract user info from resume: ${error.message}`, error.stack);
            return { error: "Failed to extract user info from resume" };
        }
    }
    static MIN_QUESTIONS = 8;
    static MAX_QUESTIONS = 12;
    async generateQuestion(context) {
        if (context.isFinished) {
            this.logger.log("Interview ended early by user. Signaling END OF INTERVIEW.");
            return "END OF INTERVIEW";
        }
        if (context.count >= AiService_1.MAX_QUESTIONS) {
            this.logger.log(`Reached maximum of ${AiService_1.MAX_QUESTIONS} questions. Ending interview.`);
            return "END OF INTERVIEW";
        }
        try {
            this.logger.log(`Generating question #${context.count}`);
            if (!context.resumeText || !context.jobDescription) {
                this.logger.warn("Missing resume or job description for question generation");
                const fallbackQuestions = [
                    "What is your experience with SOLID principles?",
                    "Tell me about a challenging project you worked on.",
                    "How do you approach testing in your projects?",
                    "Describe your experience with TypeScript and NestJS.",
                    "How do you handle technical disagreements in a team?",
                ];
                return fallbackQuestions[context.count % fallbackQuestions.length];
            }
            const previousQuestion = context.previousQuestions && context.previousQuestions.length > 0
                ? context.previousQuestions[context.previousQuestions.length - 1]
                : undefined;
            const previousAnswer = context.previousAnswers && context.previousAnswers.length > 0
                ? context.previousAnswers[context.previousAnswers.length - 1]
                : undefined;
            const aiPrompt = `You are an expert technical interviewer. You must ask at least ${AiService_1.MIN_QUESTIONS} interview questions before ending the interview. Only after at least ${AiService_1.MIN_QUESTIONS} questions (current: ${context.count}), if you have enough information, respond with ONLY the string END OF INTERVIEW (no explanation). If not, generate the next most relevant question to further assess the candidate. Do not end the interview before the minimum.`;
            const questions = await this.groqService.generateInterviewQuestions(context.jobDescription, context.resumeText, previousQuestion, previousAnswer, aiPrompt);
            if (questions[0] &&
                questions[0].trim().toUpperCase() === "END OF INTERVIEW" &&
                context.count < AiService_1.MIN_QUESTIONS) {
                this.logger.log(`AI attempted to end before minimum (${AiService_1.MIN_QUESTIONS}) questions. Forcing a fallback question.`);
                const fallbackQuestions = [
                    "Please describe a challenging project you've worked on recently.",
                    "What motivates you in your professional work?",
                    "Can you discuss one of your technical strengths?",
                    "How do you approach learning new technologies?",
                    "Describe a time you solved a difficult problem at work.",
                ];
                return fallbackQuestions[context.count % fallbackQuestions.length];
            }
            if ((!context.previousQuestions ||
                context.previousQuestions.length === 0) &&
                (!context.previousAnswers || context.previousAnswers.length === 0) &&
                questions[0] &&
                questions[0].trim().toUpperCase() === "END OF INTERVIEW") {
                return "Let's get started. Can you briefly introduce yourself and your background?";
            }
            return (questions[0] || "Tell me about your relevant experience for this role.");
        }
        catch (error) {
            this.logger.error(`Failed to generate question: ${error.message}`, error.stack);
            return "Could you describe your experience with the technologies mentioned in the job description?";
        }
    }
    async analyzeTranscript(transcript) {
        try {
            this.logger.log("Analyzing interview transcript");
            if (!transcript || transcript.trim().length === 0) {
                this.logger.warn("Empty transcript provided for analysis");
                return {
                    strengths: [],
                    weaknesses: ["No transcript data to analyze"],
                    suggestions: ["Ensure interview recording is properly captured"],
                };
            }
            const analysis = await this.groqService.analyzeTranscript(transcript);
            return {
                strengths: Array.isArray(analysis.technicalStrengths)
                    ? analysis.technicalStrengths
                    : typeof analysis.technicalStrengths === "string"
                        ? [analysis.technicalStrengths]
                        : [],
                weaknesses: Array.isArray(analysis.areasForImprovement)
                    ? analysis.areasForImprovement
                    : typeof analysis.areasForImprovement === "string"
                        ? [analysis.areasForImprovement]
                        : [],
                suggestions: Array.isArray(analysis.recommendation)
                    ? analysis.recommendation
                    : typeof analysis.recommendation === "string"
                        ? [analysis.recommendation]
                        : [],
            };
        }
        catch (error) {
            this.logger.error(`Failed to analyze transcript: ${error.message}`, error.stack);
            return {
                strengths: [],
                weaknesses: [],
                suggestions: [
                    "Unable to analyze transcript due to a technical issue. Please try again later.",
                ],
            };
        }
    }
    async generateInterviewQuestions(jobDescription, resumeContent, previousQuestion, previousAnswer) {
        return this.groqService.generateInterviewQuestions(jobDescription, resumeContent, previousQuestion, previousAnswer);
    }
    async generateFeedback(params) {
        try {
            this.logger.log(`Generating interview feedback for ${params.jobDescription} and ${params.resumeContent}`);
            if (!params.transcript || params.transcript.trim().length === 0) {
                this.logger.warn("Empty transcript provided for feedback generation");
                return {
                    overallPerformance: "Unable to generate feedback: No transcript provided",
                    technicalAccuracy: "N/A",
                    communicationEffectiveness: "N/A",
                    strengths: [],
                    areasForImprovement: [
                        "Ensure interview recording is properly captured",
                    ],
                    advice: ["Try again with a valid interview recording"],
                };
            }
            if (!params.jobDescription || params.jobDescription.trim().length === 0) {
                this.logger.warn("Empty job description provided for feedback generation");
                params.jobDescription = "No job description provided";
            }
            const feedback = await this.groqService.generateFeedback(params.transcript, params.jobDescription, params.resumeContent);
            return feedback;
        }
        catch (error) {
            this.logger.error(`Failed to generate feedback: ${error.message}`, error.stack);
            return {
                overallPerformance: "Unable to generate feedback due to a technical issue",
                technicalAccuracy: "N/A",
                communicationEffectiveness: "N/A",
                strengths: [],
                areasForImprovement: [],
                advice: ["Please try again later"],
            };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [groq_service_1.GroqService,
        config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map