import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiService } from "./ai.service";
import { GroqService } from "./services/groq.service";
import { AiController } from "./ai.controller";

@Module({
  imports: [ConfigModule],
  providers: [AiService, GroqService],
  controllers: [AiController],
  exports: [AiService, GroqService],
})
export class AiModule {}
