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
var GroqService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let GroqService = GroqService_1 = class GroqService {
    configService;
    logger = new common_1.Logger(GroqService_1.name);
    apiKey;
    apiUrl;
    defaultModel;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get("GROQ_API_KEY");
        const isDev = this.configService.get("NODE_ENV") !== "production";
        if (!apiKey && !isDev) {
            this.logger.error("GROQ_API_KEY is not defined in environment variables");
            throw new Error("GROQ_API_KEY is required for production environment");
        }
        this.apiKey = apiKey || "mock-api-key";
        this.apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        this.defaultModel =
            this.configService.get("GROQ_MODEL") || "-3.1-8b-instant";
        if (this.apiKey === "mock-api-key") {
            this.logger.warn("Using mock data for AI services - GROQ_API_KEY not provided");
        }
        else {
            this.logger.log(`Using real GROQ API for AI services with model: ${this.defaultModel}`);
        }
    }
    async generateCompletion(messages, model, temperature = 0.7, maxTokens = 1000) {
        try {
            this.logger.log(`Generating completion with ${model || this.defaultModel}`);
            const response = await axios_1.default.post(this.apiUrl, {
                model: model || this.defaultModel,
                messages,
                temperature,
                max_tokens: maxTokens,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return response.data.choices[0].message.content;
        }
        catch (error) {
            this.logger.error(`Error generating completion: ${error.message}`, error.stack);
            if (error.response) {
                this.logger.error(`API Error: ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to generate AI completion: ${error.message}`);
        }
    }
    async generateInterviewQuestions(jobDescription, resumeContent, previousQuestion, previousAnswer, aiPrompt) {
        try {
            const prompt = aiPrompt
                ? `${aiPrompt}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeContent}
${previousQuestion && previousAnswer
                    ? `PREVIOUS QUESTION:
${previousQuestion}
CANDIDATE'S ANSWER:
${previousAnswer}
`
                    : ""}`
                : `You are an expert technical interviewer. Your job is to conduct an adaptive interview, asking one question at a time. Use the candidate's job description, resume, and most recent answer to generate a highly relevant next question.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeContent}
${previousQuestion && previousAnswer
                    ? `PREVIOUS QUESTION:
${previousQuestion}
CANDIDATE'S ANSWER:
${previousAnswer}
`
                    : ""}
Ask a single, highly relevant follow-up question based on the candidate's latest answer. Do not repeat previous questions. Return ONLY the question, no explanations or numbering.`;
            const messages = [{ role: "user", content: prompt }];
            this.logger.log(`Generating interview questions with prompt: ${prompt}`);
            const completion = await this.generateCompletion(messages);
            let question = completion.trim();
            if (!previousQuestion && !previousAnswer) {
                question =
                    "Let's start with an introduction. Can you tell me about yourself and your past experience relevant to this role?";
            }
            this.logger.log(`Generated interview question: ${question}`);
            return [question];
        }
        catch (error) {
            this.logger.error(`Error generating interview questions: ${error.message}`, error.stack);
            throw new Error(`Failed to generate interview questions: ${error.message}`);
        }
    }
    async analyzeTranscript(transcript) {
        try {
            const prompt = `
You are an expert interview analyzer. Analyze the following interview transcript and provide structured feedback:

INTERVIEW TRANSCRIPT:
${transcript}

Provide an analysis with the following structure:
1. Overall assessment (1-2 paragraphs)
2. Technical strengths demonstrated (bullet points)
3. Areas for improvement (bullet points)
4. Communication skills assessment (1 paragraph)
5. Recommendation (hire/consider/reject with brief explanation)

Format your response as a JSON object with these keys: overallAssessment, technicalStrengths, areasForImprovement, communicationSkills, recommendation.
`;
            const messages = [{ role: "user", content: prompt }];
            const completion = await this.generateCompletion(messages);
            try {
                const sanitized = completion
                    .replace(/```json[\s\n]*/gi, "")
                    .replace(/```/g, "")
                    .trim();
                const firstBrace = sanitized.indexOf("{");
                const lastBrace = sanitized.lastIndexOf("}");
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    const jsonString = sanitized.substring(firstBrace, lastBrace + 1);
                    return JSON.parse(jsonString);
                }
                else {
                    this.logger.error("Could not find valid JSON object in LLM output");
                    return {
                        rawResponse: completion,
                        error: "No valid JSON object found in LLM output",
                    };
                }
            }
            catch (jsonError) {
                this.logger.error(`Error parsing JSON response: ${jsonError.message}`);
                return {
                    rawResponse: completion,
                    error: "Failed to parse structured response",
                };
            }
        }
        catch (error) {
            this.logger.error(`Error analyzing transcript: ${error.message}`, error.stack);
            throw new Error(`Failed to analyze interview transcript: ${error.message}`);
        }
    }
    async generateFeedback(transcript, jobDescription, resumeContent) {
        try {
            let prompt = `
You are an expert interview coach. Generate detailed feedback for a candidate based on their interview transcript and the job description:

JOB DESCRIPTION:
${jobDescription}

INTERVIEW TRANSCRIPT:
${transcript}
`;
            if (resumeContent) {
                prompt += `
CANDIDATE RESUME:
${resumeContent}
`;
            }
            prompt += `
Provide comprehensive feedback with the following structure:
1. Overall performance (1-2 paragraphs)
2. Technical accuracy (assessment of technical answers)
3. Communication effectiveness (clarity, conciseness, structure)
4. Strengths demonstrated (3-5 points)
5. Areas for improvement (3-5 points)
6. Specific advice for future interviews (3-5 actionable tips)
7. Verdict: Is the candidate hireable or not? (Yes/No with 1-line justification)

Format your response as a JSON object with these keys: overallPerformance, technicalAccuracy, communicationEffectiveness, strengths, areasForImprovement, advice, verdict.
`;
            const messages = [{ role: "user", content: prompt }];
            const completion = await this.generateCompletion(messages);
            try {
                const sanitized = completion
                    .replace(/```json[\s\n]*/gi, "")
                    .replace(/```/g, "")
                    .trim();
                const firstBrace = sanitized.indexOf("{");
                const lastBrace = sanitized.lastIndexOf("}");
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    const jsonString = sanitized.substring(firstBrace, lastBrace + 1);
                    return JSON.parse(jsonString);
                }
                else {
                    this.logger.error("Could not find valid JSON object in LLM output");
                    return {
                        rawResponse: completion,
                        error: "No valid JSON object found in LLM output",
                    };
                }
            }
            catch (jsonError) {
                this.logger.error(`Error parsing JSON response: ${jsonError.message}`);
                return {
                    rawResponse: completion,
                    error: "Failed to parse structured response",
                };
            }
        }
        catch (error) {
            this.logger.error(`Error generating feedback: ${error.message}`, error.stack);
            throw new Error(`Failed to generate interview feedback: ${error.message}`);
        }
    }
};
exports.GroqService = GroqService;
exports.GroqService = GroqService = GroqService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GroqService);
//# sourceMappingURL=groq.service.js.map