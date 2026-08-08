"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get((config_1.ConfigService));
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.enableCors({
        credentials: true,
        origin: configService.get('app.webOrigin', { infer: true }),
    });
    app.enableShutdownHooks();
    await app.listen(configService.get('app.port', { infer: true }));
}
void bootstrap();
//# sourceMappingURL=main.js.map