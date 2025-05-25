import { Module } from "@nestjs/common";
import { InterviewController } from "./interview.controller";
import { InterviewService } from "./interview.service";
import { AiModule } from "../ai/ai.module";

import { TypeOrmModule } from "@nestjs/typeorm";
import { InterviewSession } from "./interview-session.entity";

@Module({
  imports: [AiModule, TypeOrmModule.forFeature([InterviewSession])],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
