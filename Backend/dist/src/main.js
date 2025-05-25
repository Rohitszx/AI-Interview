"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix("api/v1");
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
    app.use(bodyParser.raw({ limit: "10mb" }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        disableErrorMessages: process.env.NODE_ENV === "production",
    }));
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginOpenerPolicy: { policy: "unsafe-none" },
        contentSecurityPolicy: false,
    }));
    app.use(cookieParser());
    app.enableCors({
        origin: [
            "http://localhost:8080",
            "http://127.0.0.1:8080",
        ],
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Accept",
            "Authorization",
            "Origin",
            "X-Requested-With",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Headers",
        ],
        exposedHeaders: ["Content-Length", "Date", "Content-Type"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Credentials", "true");
        if (req.method === "OPTIONS") {
            res.sendStatus(204);
        }
        else {
            next();
        }
    });
    console.log("[CORS] CORS middleware enabled for local frontend origins.");
    if (process.env.NODE_ENV !== "production") {
        const config = new swagger_1.DocumentBuilder()
            .setTitle("NORA AI Interview API")
            .setDescription("API for the NORA AI Interview System")
            .setVersion("1.0")
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api/docs", app, document);
    }
    const port = configService.get("PORT", 3002);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map