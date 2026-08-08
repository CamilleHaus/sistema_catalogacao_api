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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let AuthorizationService = class AuthorizationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    assertCompanyAccess(user, empresaId) {
        if (!user.empresaId || user.empresaId !== empresaId) {
            throw new common_1.NotFoundException('Recurso não encontrado.');
        }
    }
    async assertProjectAccess(user, projetoId, permissaoExigida = client_1.PermissaoProjeto.VISUALIZAR) {
        if (!user.empresaId || user.papel === client_1.PapelUsuario.ADMIN_GLOBAL) {
            throw new common_1.NotFoundException('Projeto não encontrado.');
        }
        const projeto = await this.prisma.projeto.findFirst({
            where: {
                id: projetoId,
                empresaId: user.empresaId,
                ...(user.papel === client_1.PapelUsuario.USUARIO
                    ? {
                        status: client_1.StatusProjeto.ATIVO,
                        usuarios: {
                            some: {
                                usuarioId: user.id,
                                ...(permissaoExigida === client_1.PermissaoProjeto.EDITAR
                                    ? { permissao: client_1.PermissaoProjeto.EDITAR }
                                    : {}),
                            },
                        },
                    }
                    : {}),
            },
        });
        if (!projeto) {
            throw new common_1.NotFoundException('Projeto não encontrado.');
        }
        return projeto;
    }
    async assertCompanyEditor(user) {
        if (!user.empresaId || user.papel === client_1.PapelUsuario.ADMIN_GLOBAL) {
            throw new common_1.NotFoundException('Empresa não encontrada.');
        }
        if (user.papel === client_1.PapelUsuario.ADMIN_EMPRESA)
            return;
        const editor = await this.prisma.usuarioProjeto.findFirst({
            where: {
                usuarioId: user.id,
                permissao: client_1.PermissaoProjeto.EDITAR,
                projeto: { empresaId: user.empresaId, status: client_1.StatusProjeto.ATIVO },
            },
            select: { id: true },
        });
        if (!editor)
            throw new common_1.NotFoundException('Recurso não encontrado.');
    }
};
exports.AuthorizationService = AuthorizationService;
exports.AuthorizationService = AuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthorizationService);
//# sourceMappingURL=authorization.service.js.map