import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { ResumeService } from "./resume.service";
import * as multer from "multer";

// In-memory store for uploaded resumes (id -> text)
const resumeStore: Map<string, string> = new Map();

@ApiTags("Resume")
@Controller("resume")
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  static getResumeTextById(id: string): string | undefined {
    return resumeStore.get(id);
  }

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: Object })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB in bytes
      },
    }),
  )
  async uploadResume(
    @UploadedFile() file: multer.File,
  ): Promise<{ id: string; text: string }> {
    if (!file) {
      console.error(
        '[Resume Upload] No file received. The field name must be "file" and sent as multipart/form-data.',
      );
      throw new BadRequestException(
        'No file uploaded. Field name must be "file".',
      );
    }
    const text = await this.resumeService.extractText(
      file.buffer,
      file.originalname,
    );
    const id = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    resumeStore.set(id, text);
    return { id, text };
  }
}
