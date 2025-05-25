import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { Logger } from "@nestjs/common";

import { ResumeModule } from "./resume/resume.module";
import { JdModule } from "./jd/jd.module";
import { InterviewModule } from "./interview/interview.module";
import { AiModule } from "./ai/ai.module";
import { InterviewSession } from "./interview/interview-session.entity";

const typeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const dbType = config.get("DB_TYPE", "postgres");
    const logger = new Logger("TypeORM");

    logger.log(`Using database type: ${dbType}`);

    if (dbType === "sqlite") {
      return {
        type: "sqlite",
        database: config.get("DB_DATABASE_FILE", "nora_ai.sqlite"),
        entities: [InterviewSession],
        synchronize: process.env.NODE_ENV !== "production",
        logging: process.env.NODE_ENV !== "production",
      };
    } else {
      return {
        type: "postgres",
        host: config.get("DB_HOST"),
        port: +config.get("DB_PORT"),
        username: config.get("DB_USERNAME"),
        password: config.get("DB_PASSWORD"),
        database: config.get("DB_DATABASE"),
        entities: [InterviewSession],
        synchronize: process.env.NODE_ENV !== "production",
        logging: process.env.NODE_ENV !== "production",
        ssl:
          process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      };
    }
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Database connection
    typeOrmConfig,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    CacheModule.register({
      ttl: 60,
      max: 100,
      isGlobal: true,
    }),
    ResumeModule,
    JdModule,
    InterviewModule,
    AiModule,
  ],
})
export class AppModule {}
