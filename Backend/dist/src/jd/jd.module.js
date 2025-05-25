"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JdModule = void 0;
const common_1 = require("@nestjs/common");
const jd_controller_1 = require("./jd.controller");
const jd_service_1 = require("./jd.service");
let JdModule = class JdModule {
};
exports.JdModule = JdModule;
exports.JdModule = JdModule = __decorate([
    (0, common_1.Module)({
        controllers: [jd_controller_1.JdController],
        providers: [jd_service_1.JdService],
        exports: [jd_service_1.JdService],
    })
], JdModule);
//# sourceMappingURL=jd.module.js.map