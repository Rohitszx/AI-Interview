import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class JdService {
  private readonly logger = new Logger(JdService.name);
  // Extract text from PDF or DOCX JDs
  async extractText(fileBuffer: Buffer, fileName: string): Promise<string> {
    this.logger.log(`Extracting text from JD: ${fileName}`);
    const ext = fileName.split(".").pop()?.toLowerCase();
    try {
      if (ext === "pdf") {
        const pdfParse = await import("pdf-parse");
        const data = await (pdfParse.default || pdfParse)(fileBuffer);
        return data.text.trim();
      } else if (ext === "docx") {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value.trim();
      } else {
        throw new Error(
          "Unsupported file type. Only PDF and DOCX are supported.",
        );
      }
    } catch (error) {
      this.logger.error(`Failed to extract text from JD ${fileName}:`, error);
      throw new Error(
        "Failed to extract text from JD. Please upload a valid PDF or DOCX file.",
      );
    }
  }
}
