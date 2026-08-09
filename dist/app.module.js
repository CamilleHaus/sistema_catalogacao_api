"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const app_config_1 = __importDefault(require("./config/app.config"));
const environment_validation_1 = require("./config/environment.validation");
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const access_token_guard_1 = require("./auth/access-token.guard");
const force_password_change_guard_1 = require("./auth/guards/force-password-change.guard");
const roles_guard_1 = require("./auth/guards/roles.guard");
const admin_global_module_1 = require("./admin-global/admin-global.module");
const users_module_1 = require("./users/users.module");
const projects_module_1 = require("./projects/projects.module");
const clients_module_1 = require("./clients/clients.module");
const artists_module_1 = require("./artists/artists.module");
const work_statuses_module_1 = require("./work-statuses/work-statuses.module");
const techniques_module_1 = require("./techniques/techniques.module");
const locations_module_1 = require("./locations/locations.module");
const works_module_1 = require("./works/works.module");
const dimensions_module_1 = require("./dimensions/dimensions.module");
const work_photos_module_1 = require("./work-photos/work-photos.module");
const cataloging_module_1 = require("./cataloging/cataloging.module");
const research_module_1 = require("./research/research.module");
const financial_module_1 = require("./financial/financial.module");
const work_media_module_1 = require("./work-media/work-media.module");
const management_module_1 = require("./management/management.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                load: [app_config_1.default],
                validate: environment_validation_1.validateEnvironment,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            admin_global_module_1.AdminGlobalModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            clients_module_1.ClientsModule,
            artists_module_1.ArtistsModule,
            work_statuses_module_1.WorkStatusesModule,
            techniques_module_1.TechniquesModule,
            locations_module_1.LocationsModule,
            works_module_1.WorksModule,
            dimensions_module_1.DimensionsModule,
            work_photos_module_1.WorkPhotosModule,
            cataloging_module_1.CatalogingModule,
            research_module_1.ResearchModule,
            financial_module_1.FinancialModule,
            work_media_module_1.WorkMediaModule,
            management_module_1.ManagementModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: access_token_guard_1.AccessTokenGuard },
            { provide: core_1.APP_GUARD, useClass: force_password_change_guard_1.ForcePasswordChangeGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map