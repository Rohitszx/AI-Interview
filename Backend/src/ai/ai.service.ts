import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IAiService } from "./interfaces/ai.interface";
import { GroqService } from "./services/groq.service";

@Injectable()
export class AiService implements IAiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly groqService: GroqService,
    private readonly configService: ConfigService,
  ) {}

  async extractUserInfoFromResume(resumeText: string): Promise<{
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    [key: string]: any;
  }> {
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
      // Extract only the first valid JSON object
      const firstBrace = sanitized.indexOf("{");
      const lastBrace = sanitized.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonString = sanitized.substring(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(jsonString);
        } catch (jsonError) {
          this.logger.error(
            `Error parsing extracted user info: ${jsonError.message}`,
          );
          return {
            rawResponse: completion,
            error: "Failed to parse structured user info",
          };
        }
      } else {
        this.logger.error("Could not find valid JSON object in LLM output");
        return {
          rawResponse: completion,
          error: "No valid JSON object found in LLM output",
        };
      }
    } catch (error) {
      this.logger.error(
        `Failed to extract user info from resume: ${error.message}`,
        error.stack,
      );
      return { error: "Failed to extract user info from resume" };
    }
  }

  private static readonly MIN_QUESTIONS = 8;
  private static readonly MAX_QUESTIONS = 12;

  async generateQuestion(context: {
    resumeText?: string;
    jobDescription?: string;
    previousQuestions?: string[];
    previousAnswers?: string[];
    count: number;
    startTime?: string;
    isFinished?: boolean;
  }): Promise<string> {
    if (context.isFinished) {
      this.logger.log(
        "Interview ended early by user. Signaling END OF INTERVIEW.",
      );
      return "END OF INTERVIEW";
    }

    // Enforce maximum number of questions
    if (context.count >= AiService.MAX_QUESTIONS) {
      this.logger.log(
        `Reached maximum of ${AiService.MAX_QUESTIONS} questions. Ending interview.`,
      );
      return "END OF INTERVIEW";
    }

    try {
      this.logger.log(`Generating question #${context.count}`);

      // Validate inputs
      if (!context.resumeText || !context.jobDescription) {
        this.logger.warn(
          "Missing resume or job description for question generation",
        );
        // Fallback questions if inputs are missing
        const fallbackQuestions = [
          "What is your experience with SOLID principles?",
          "Tell me about a challenging project you worked on.",
          "How do you approach testing in your projects?",
          "Describe your experience with TypeScript and NestJS.",
          "How do you handle technical disagreements in a team?",
        ];
        return fallbackQuestions[context.count % fallbackQuestions.length];
      }

      // Delegate to GroqService with AI-driven end logic
      const previousQuestion =
        context.previousQuestions && context.previousQuestions.length > 0
          ? context.previousQuestions[context.previousQuestions.length - 1]
          : undefined;
      const previousAnswer =
        context.previousAnswers && context.previousAnswers.length > 0
          ? context.previousAnswers[context.previousAnswers.length - 1]
          : undefined;

      // Enhanced prompt for AI-driven interview ending with minimum enforcement
      const aiPrompt = `You are an expert technical interviewer. You must ask at least ${AiService.MIN_QUESTIONS} interview questions before ending the interview. Only after at least ${AiService.MIN_QUESTIONS} questions (current: ${context.count}), if you have enough information, respond with ONLY the string END OF INTERVIEW (no explanation). If not, generate the next most relevant question to further assess the candidate. Do not end the interview before the minimum.`;

      const questions = await this.groqService.generateInterviewQuestions(
        context.jobDescription,
        context.resumeText,
        previousQuestion,
        previousAnswer,
        aiPrompt,
      );

      // Prevent END OF INTERVIEW before reaching minimum questions
      if (
        questions[0] &&
        questions[0].trim().toUpperCase() === "END OF INTERVIEW" &&
        context.count < AiService.MIN_QUESTIONS
      ) {
        this.logger.log(
          `AI attempted to end before minimum (${AiService.MIN_QUESTIONS}) questions. Forcing a fallback question.`,
        );
        // Provide a fallback or generic question
        const fallbackQuestions = [
          "Please describe a challenging project you've worked on recently.",
          "What motivates you in your professional work?",
          "Can you discuss one of your technical strengths?",
          "How do you approach learning new technologies?",
          "Describe a time you solved a difficult problem at work.",
        ];
        return fallbackQuestions[context.count % fallbackQuestions.length];
      }

      // Prevent END OF INTERVIEW as first question (already present)
      if (
        (!context.previousQuestions ||
          context.previousQuestions.length === 0) &&
        (!context.previousAnswers || context.previousAnswers.length === 0) &&
        questions[0] &&
        questions[0].trim().toUpperCase() === "END OF INTERVIEW"
      ) {
        return "Let's get started. Can you briefly introduce yourself and your background?";
      }

      return (
        questions[0] || "Tell me about your relevant experience for this role."
      );
    } catch (error) {
      this.logger.error(
        `Failed to generate question: ${error.message}`,
        error.stack,
      );
      // Provide a fallback question in case of error
      return "Could you describe your experience with the technologies mentioned in the job description?";
    }
  }

  async analyzeTranscript(transcript: string): Promise<{
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  }> {
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
    } catch (error) {
      this.logger.error(
        `Failed to analyze transcript: ${error.message}`,
        error.stack,
      );
      return {
        strengths: [],
        weaknesses: [],
        suggestions: [
          "Unable to analyze transcript due to a technical issue. Please try again later.",
        ],
      };
    }
  }

  async generateInterviewQuestions(
    jobDescription: string,
    resumeContent: string,
    previousQuestion?: string,
    previousAnswer?: string,
  ): Promise<string[]> {
    return this.groqService.generateInterviewQuestions(
      jobDescription,
      resumeContent,
      previousQuestion,
      previousAnswer,
    );
  }

  async generateFeedback(params: {
    transcript: string;
    jobDescription: string;
    resumeContent?: string;
  }): Promise<any> {
    try {
      this.logger.log(
        `Generating interview feedback for ${params.jobDescription} and ${params.resumeContent}`,
      );

      // Validate inputs
      if (!params.transcript || params.transcript.trim().length === 0) {
        this.logger.warn("Empty transcript provided for feedback generation");
        return {
          overallPerformance:
            "Unable to generate feedback: No transcript provided",
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
        this.logger.warn(
          "Empty job description provided for feedback generation",
        );
        params.jobDescription = "No job description provided";
      }

      // Delegate to GroqService
      const feedback = await this.groqService.generateFeedback(
        params.transcript,
        params.jobDescription,
        params.resumeContent,
      );

      return feedback;
    } catch (error) {
      this.logger.error(
        `Failed to generate feedback: ${error.message}`,
        error.stack,
      );
      // Return a default response in case of error
      return {
        overallPerformance:
          "Unable to generate feedback due to a technical issue",
        technicalAccuracy: "N/A",
        communicationEffectiveness: "N/A",
        strengths: [],
        areasForImprovement: [],
        advice: ["Please try again later"],
      };
    }
  }
}
