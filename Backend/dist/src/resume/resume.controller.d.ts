import { ResumeService } from "./resume.service";
import * as multer from "multer";
export declare class ResumeController {
    private readonly resumeService;
    constructor(resumeService: ResumeService);
    static getResumeTextById(id: string): string | undefined;
    uploadResume(file: multer.File): Promise<{
        id: string;
        text: string;
    }>;
}
