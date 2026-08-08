"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogingModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const cataloging_controller_1 = require("./cataloging.controller");
const cataloging_service_1 = require("./cataloging.service");
const reference_data_controller_1 = require("./reference-data.controller");
const reference_data_service_1 = require("./reference-data.service");
let CatalogingModule = class CatalogingModule {
};
exports.CatalogingModule = CatalogingModule;
exports.CatalogingModule = CatalogingModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [cataloging_controller_1.CatalogingController, reference_data_controller_1.ReferenceDataController],
        providers: [cataloging_service_1.CatalogingService, reference_data_service_1.ReferenceDataService],
    })
], CatalogingModule);
//# sourceMappingURL=cataloging.module.js.map