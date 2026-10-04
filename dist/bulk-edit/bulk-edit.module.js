"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkEditModule = void 0;
const common_1 = require("@nestjs/common");
const advanced_search_module_1 = require("../advanced-search/advanced-search.module");
const auth_module_1 = require("../auth/auth.module");
const bulk_edit_controller_1 = require("./bulk-edit.controller");
const bulk_edit_service_1 = require("./bulk-edit.service");
let BulkEditModule = class BulkEditModule {
};
exports.BulkEditModule = BulkEditModule;
exports.BulkEditModule = BulkEditModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, advanced_search_module_1.AdvancedSearchModule],
        controllers: [bulk_edit_controller_1.BulkEditController],
        providers: [bulk_edit_service_1.BulkEditService],
    })
], BulkEditModule);
//# sourceMappingURL=bulk-edit.module.js.map