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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const require_project_access_decorator_1 = require("../auth/decorators/require-project-access.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const financial_dto_1 = require("./dto/financial.dto");
const financial_service_1 = require("./financial.service");
let FinancialController = class FinancialController {
    service;
    constructor(service) {
        this.service = service;
    }
    get(p, w) {
        return this.service.get(p, w);
    }
    createAcquisition(p, w, dto) {
        return this.service.saveTransaction(p, w, 'aquisicao', dto, true);
    }
    updateAcquisition(p, w, dto) {
        return this.service.saveTransaction(p, w, 'aquisicao', dto, false);
    }
    removeAcquisition(p, w) {
        return this.service.removeTransaction(p, w, 'aquisicao');
    }
    createSale(p, w, dto) {
        return this.service.saveTransaction(p, w, 'venda', dto, true);
    }
    updateSale(p, w, dto) {
        return this.service.saveTransaction(p, w, 'venda', dto, false);
    }
    removeSale(p, w) {
        return this.service.removeTransaction(p, w, 'venda');
    }
    createInvoice(p, w, dto) {
        return this.service.saveDocument(p, w, 'nota', dto);
    }
    updateInvoice(p, w, id, dto) {
        return this.service.saveDocument(p, w, 'nota', dto, id);
    }
    removeInvoice(p, w, id) {
        return this.service.removeDocument(p, w, 'nota', id);
    }
    createPayment(p, w, dto) {
        return this.service.saveDocument(p, w, 'pagamento', dto);
    }
    updatePayment(p, w, id, dto) {
        return this.service.saveDocument(p, w, 'pagamento', dto, id);
    }
    removePayment(p, w, id) {
        return this.service.removeDocument(p, w, 'pagamento', id);
    }
    createSaleReceipt(p, w, dto) {
        return this.service.saveDocument(p, w, 'venda', dto);
    }
    updateSaleReceipt(p, w, id, dto) {
        return this.service.saveDocument(p, w, 'venda', dto, id);
    }
    removeSaleReceipt(p, w, id) {
        return this.service.removeDocument(p, w, 'venda', id);
    }
    createEvaluation(p, w, dto) {
        return this.service.saveEvaluation(p, w, dto);
    }
    updateEvaluation(p, w, id, dto) {
        return this.service.saveEvaluation(p, w, dto, id);
    }
    removeEvaluation(p, w, id) {
        return this.service.removeChild(p, w, 'avaliacao', id);
    }
    createInsurance(p, w, dto) {
        return this.service.saveInsurance(p, w, dto);
    }
    updateInsurance(p, w, id, dto) {
        return this.service.saveInsurance(p, w, dto, id);
    }
    removeInsurance(p, w, id) {
        return this.service.removeChild(p, w, 'seguro', id);
    }
};
exports.FinancialController = FinancialController;
__decorate([
    (0, common_1.Get)(),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.VISUALIZAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('aquisicao'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveTransactionDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "createAcquisition", null);
__decorate([
    (0, common_1.Patch)('aquisicao'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveTransactionDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "updateAcquisition", null);
__decorate([
    (0, common_1.Delete)('aquisicao'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "removeAcquisition", null);
__decorate([
    (0, common_1.Post)('venda'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveTransactionDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "createSale", null);
__decorate([
    (0, common_1.Patch)('venda'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveTransactionDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "updateSale", null);
__decorate([
    (0, common_1.Delete)('venda'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "removeSale", null);
__decorate([
    (0, common_1.Post)('aquisicao/notas-fiscais'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveDocumentDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Patch)('aquisicao/notas-fiscais/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, financial_dto_1.SaveDocumentDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Delete)('aquisicao/notas-fiscais/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "removeInvoice", null);
__decorate([
    (0, common_1.Post)('aquisicao/comprovantes'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveDocumentDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Patch)('aquisicao/comprovantes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, financial_dto_1.SaveDocumentDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Delete)('aquisicao/comprovantes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "removePayment", null);
__decorate([
    (0, common_1.Post)('venda/comprovantes'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveDocumentDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "createSaleReceipt", null);
__decorate([
    (0, common_1.Patch)('venda/comprovantes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, financial_dto_1.SaveDocumentDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "updateSaleReceipt", null);
__decorate([
    (0, common_1.Delete)('venda/comprovantes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "removeSaleReceipt", null);
__decorate([
    (0, common_1.Post)('avaliacoes'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveEvaluationDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "createEvaluation", null);
__decorate([
    (0, common_1.Patch)('avaliacoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, financial_dto_1.SaveEvaluationDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "updateEvaluation", null);
__decorate([
    (0, common_1.Delete)('avaliacoes/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "removeEvaluation", null);
__decorate([
    (0, common_1.Post)('seguros'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_dto_1.SaveInsuranceDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "createInsurance", null);
__decorate([
    (0, common_1.Patch)('seguros/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, financial_dto_1.SaveInsuranceDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "updateInsurance", null);
__decorate([
    (0, common_1.Delete)('seguros/:id'),
    (0, require_project_access_decorator_1.RequireProjectAccess)(client_1.PermissaoProjeto.EDITAR),
    __param(0, (0, common_1.Param)('projetoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Param)('obraId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "removeInsurance", null);
exports.FinancialController = FinancialController = __decorate([
    (0, common_1.Controller)('projetos/:projetoId/obras/:obraId/financeiro'),
    (0, roles_decorator_1.Roles)(client_1.PapelUsuario.ADMIN_EMPRESA, client_1.PapelUsuario.USUARIO),
    __metadata("design:paramtypes", [financial_service_1.FinancialService])
], FinancialController);
//# sourceMappingURL=financial.controller.js.map