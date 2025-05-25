"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JdController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jd_service_1 = require("./jd.service");
const multer = require("multer");
const jdStore = new Map();
let JdController = class JdController {
    jdService;
    constructor(jdService) {
        this.jdService = jdService;
    }
    static getJdTextById(id) {
        return jdStore.get(id);
    }
    async uploadJd(file) {
        const text = await this.jdService.extractText(file.buffer, file.originalname);
        const id = `jd_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        jdStore.set(id, text);
        return { id, text };
    }
};
exports.JdController = JdController;
__decorate([
    (0, common_1.Post)("upload"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: Object }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof multer !== "undefined" && multer.File) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], JdController.prototype, "uploadJd", null);
exports.JdController = JdController = __decorate([
    (0, swagger_1.ApiTags)("JD"),
    (0, common_1.Controller)("jd"),
    __metadata("design:paramtypes", [jd_service_1.JdService])
], JdController);
//# sourceMappingURL=jd.controller.js.map