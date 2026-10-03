"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const auth_module_1 = require("../auth/auth.module");
const storage_controller_1 = require("./storage.controller");
const storage_service_1 = require("./storage.service");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            platform_express_1.MulterModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    limits: {
                        files: 1,
                        fileSize: config.get('storage.maxFileSizeBytes', { infer: true }),
                    },
                    fileFilter: (_req, file, callback) => {
                        if (!storage_service_1.ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
                            callback(new common_1.BadRequestException('Formato não aceito. Envie imagem, PDF, documento, planilha, ' +
                                'apresentação, áudio, vídeo ou ZIP.'), false);
                            return;
                        }
                        callback(null, true);
                    },
                }),
            }),
        ],
        controllers: [storage_controller_1.StorageController],
        providers: [storage_service_1.StorageService],
        exports: [storage_service_1.StorageService],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map