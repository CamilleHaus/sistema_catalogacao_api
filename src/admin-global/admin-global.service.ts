import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PapelUsuario, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import type { AppConfig } from '../config/app.config';
import { isValidCpf, maskCpf, normalizeCpf } from '../common/utils/cpf';
import { PrismaService } from '../database/prisma.service';
import type { CreateCompanyDto } from './dto/create-company.dto';
import type { ListUsersQueryDto } from './dto/list-users-query.dto';

@Injectable()
export class AdminGlobalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async createCompany(dto: CreateCompanyDto) {
    const email = dto.administrador.email.trim().toLowerCase();
    const cpf = normalizeCpf(dto.administrador.cpf);

    if (!isValidCpf(cpf)) {
      throw new BadRequestException('CPF inválido.');
    }

    const passwordHash = await argon2.hash(dto.administrador.senhaTemporaria, {
      type: argon2.argon2id,
    });

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const empresa = await transaction.empresa.create({
          data: { nome: dto.empresa.nome.trim() },
        });
        const primeiroAdmin = await transaction.usuario.create({
          data: {
            empresaId: empresa.id,
            nome: dto.administrador.nome.trim(),
            email,
            cpf,
            senhaHash: passwordHash,
            papel: PapelUsuario.ADMIN_EMPRESA,
            ativo: true,
            deveAlterarSenha: true,
          },
          select: this.safeUserSelect,
        });

        return {
          empresa,
          primeiroAdmin: {
            ...primeiroAdmin,
            cpfMascarado: maskCpf(cpf),
          },
        };
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  listCompanies() {
    return this.prisma.empresa.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: { select: { usuarios: true, projetos: true } },
      },
    });
  }

  async listUsers(query: ListUsersQueryDto) {
    const search = query.busca?.trim();
    const where: Prisma.UsuarioWhereInput = search
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { empresa: { nome: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};
    const skip = (query.pagina - 1) * query.limite;
    const [usuarios, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        select: {
          ...this.safeUserSelect,
          cpf: true,
          empresa: { select: { id: true, nome: true } },
        },
        orderBy: { nome: 'asc' },
        skip,
        take: query.limite,
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      dados: usuarios.map(({ cpf, ...usuario }) => ({
        ...usuario,
        cpfMascarado: maskCpf(cpf),
      })),
      paginacao: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite),
      },
    };
  }

  async resetPassword(usuarioId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const passwordHash = await argon2.hash(
      this.configService.get('auth.resetPassword', { infer: true }),
      { type: argon2.argon2id },
    );

    await this.prisma.$transaction([
      this.prisma.usuario.update({
        where: { id: usuarioId },
        data: { senhaHash: passwordHash, deveAlterarSenha: true },
      }),
      this.prisma.sessao.updateMany({
        where: { usuarioId, revogadoEm: null },
        data: { revogadoEm: new Date() },
      }),
    ]);

    return { message: 'Senha redefinida e sessões revogadas.' };
  }

  async updateCompanyAdminStatus(usuarioId: string, ativo: boolean) {
    const admin = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, papel: PapelUsuario.ADMIN_EMPRESA },
      select: { id: true },
    });

    if (!admin) {
      throw new NotFoundException('Administrador da empresa não encontrado.');
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.usuario.update({
        where: { id: usuarioId },
        data: { ativo },
      });

      if (!ativo) {
        await transaction.sessao.updateMany({
          where: { usuarioId, revogadoEm: null },
          data: { revogadoEm: new Date() },
        });
      }
    });

    return { id: usuarioId, ativo };
  }

  private readonly safeUserSelect = {
    id: true,
    empresaId: true,
    nome: true,
    email: true,
    papel: true,
    ativo: true,
    deveAlterarSenha: true,
    criadoEm: true,
    atualizadoEm: true,
  } satisfies Prisma.UsuarioSelect;

  private handleUniqueConstraint(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Empresa, e-mail ou CPF já cadastrado.');
    }
  }
}
