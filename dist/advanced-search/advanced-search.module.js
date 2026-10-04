"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const works_module_1 = require("../works/works.module");
const advanced_search_controller_1 = require("./advanced-search.controller");
const advanced_search_service_1 = require("./advanced-search.service");
let AdvancedSearchModule = class AdvancedSearchModule {
};
exports.AdvancedSearchModule = AdvancedSearchModule;
exports.AdvancedSearchModule = AdvancedSearchModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, works_module_1.WorksModule],
        controllers: [advanced_search_controller_1.AdvancedSearchController],
        providers: [advanced_search_service_1.AdvancedSearchService],
        exports: [advanced_search_service_1.AdvancedSearchService],
    })
], AdvancedSearchModule);
//# sourceMappingURL=advanced-search.module.js.map