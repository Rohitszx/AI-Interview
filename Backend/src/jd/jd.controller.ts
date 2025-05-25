import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { JdService } from "./jd.service";
import * as multer from "multer";

// In-memory store for uploaded JDs (id -> text)
const jdStore: Map<string, string> = new Map();

@ApiTags("JD")
@Controller("jd")
export class JdController {
  constructor(private readonly jdService: JdService) {}

  static getJdTextById(id: string): string | undefined {
    return jdStore.get(id);
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
  async uploadJd(
    @UploadedFile() file: multer.File,
  ): Promise<{ id: string; text: string }> {
    const text = await this.jdService.extractText(
      file.buffer,
      file.originalname,
    );
    const id = `jd_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    jdStore.set(id, text);
    return { id, text };
  }
}
