"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("@nestjs/common");
const resume_module_1 = require("./resume/resume.module");
const jd_module_1 = require("./jd/jd.module");
const interview_module_1 = require("./interview/interview.module");
const ai_module_1 = require("./ai/ai.module");
const interview_session_entity_1 = require("./interview/interview-session.entity");
const typeOrmConfig = typeorm_1.TypeOrmModule.forRootAsync({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (config) => {
        const dbType = config.get("DB_TYPE", "postgres");
        const logger = new common_2.Logger("TypeORM");
        logger.log(`Using database type: ${dbType}`);
        if (dbType === "sqlite") {
            return {
                type: "sqlite",
                database: config.get("DB_DATABASE_FILE", "nora_ai.sqlite"),
                entities: [interview_session_entity_1.InterviewSession],
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.NODE_ENV !== "production",
            };
        }
        else {
            return {
                type: "postgres",
                host: config.get("DB_HOST"),
                port: +config.get("DB_PORT"),
                username: config.get("DB_USERNAME"),
                password: config.get("DB_PASSWORD"),
                database: config.get("DB_DATABASE"),
                entities: [interview_session_entity_1.InterviewSession],
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.NODE_ENV !== "production",
                ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
            };
        }
    },
});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeOrmConfig,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60,
                    limit: 10,
                },
            ]),
            cache_manager_1.CacheModule.register({
                ttl: 60,
                max: 100,
                isGlobal: true,
            }),
            resume_module_1.ResumeModule,
            jd_module_1.JdModule,
            interview_module_1.InterviewModule,
            ai_module_1.AiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map