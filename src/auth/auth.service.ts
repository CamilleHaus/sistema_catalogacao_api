import {
  ForbiddenException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Usuario } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomBytes, randomUUID } from 'node:crypto';
import type { AppConfig } from '../config/app.config';
import { PrismaService } from '../database/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { AccessTokenPayload, AuthenticatedUser } from './auth.types';

interface SessionContext {
  userAgent?: string;
  ip?: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private dummyPasswordHash = '';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async onModuleInit() {
    this.dummyPasswordHash = await argon2.hash(
      randomBytes(32).toString('base64url'),
      { type: argon2.argon2id },
    );
  }

  async login(dto: LoginDto, context: SessionContext) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });

    const passwordMatches = await argon2.verify(
      user?.senhaHash ?? this.dummyPasswordHash,
      dto.senha,
    );

    if (!user || !user.ativo || !passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const sessionId = randomUUID();
    const refreshSecret = this.createRefreshSecret();
    const refreshToken = `${sessionId}.${refreshSecret}`;
    const sessionTtlDays = this.configService.get('auth.sessionTtlDays', {
      infer: true,
    });

    await this.prisma.sessao.create({
      data: {
        id: sessionId,
        usuarioId: user.id,
        refreshTokenHash: await argon2.hash(refreshSecret, {
          type: argon2.argon2id,
        }),
        userAgent: context.userAgent,
        ipHash: context.ip ? await this.hashIp(context.ip) : undefined,
        expiraEm: new Date(Date.now() + sessionTtlDays * 86_400_000),
      },
    });

    return {
      accessToken: await this.createAccessToken(user.id, sessionId),
      refreshToken,
      usuario: this.toAuthenticatedUser(user, sessionId),
    };
  }

  async refresh(rawRefreshToken: string | undefined) {
    const parsedToken = this.parseRefreshToken(rawRefreshToken);
    const session = await this.prisma.sessao.findUnique({
      where: { id: parsedToken.sessionId },
      include: { usuario: true },
    });

    if (
      !session ||
      session.revogadoEm ||
      session.expiraEm <= new Date() ||
      !session.usuario.ativo
    ) {
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }

    const refreshTokenMatches = await argon2.verify(
      session.refreshTokenHash,
      parsedToken.secret,
    );

    if (!refreshTokenMatches) {
      await this.prisma.sessao.update({
        where: { id: session.id },
        data: { revogadoEm: new Date() },
      });
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }

    const nextSecret = this.createRefreshSecret();
    await this.prisma.sessao.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: await argon2.hash(nextSecret, {
          type: argon2.argon2id,
        }),
      },
    });

    return {
      accessToken: await this.createAccessToken(session.usuario.id, session.id),
      refreshToken: `${session.id}.${nextSecret}`,
      usuario: this.toAuthenticatedUser(session.usuario, session.id),
    };
  }

  async logout(user: AuthenticatedUser) {
    await this.prisma.sessao.updateMany({
      where: {
        id: user.sessaoId,
        usuarioId: user.id,
        revogadoEm: null,
      },
      data: { revogadoEm: new Date() },
    });
  }

  async changeRequiredPassword(user: AuthenticatedUser, newPassword: string) {
    if (!user.deveAlterarSenha) {
      throw new ForbiddenException(
        'A troca obrigatória de senha não está pendente.',
      );
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id: user.id },
      data: {
        senhaHash: await argon2.hash(newPassword, { type: argon2.argon2id }),
        deveAlterarSenha: false,
      },
    });

    return this.toAuthenticatedUser(updatedUser, user.sessaoId);
  }

  async authenticateAccessToken(token: string): Promise<AuthenticatedUser> {
    let payload: AccessTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret: this.configService.get('auth.jwtSecret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    if (!payload.sub || !payload.sid) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    const session = await this.prisma.sessao.findFirst({
      where: {
        id: payload.sid,
        usuarioId: payload.sub,
        revogadoEm: null,
        expiraEm: { gt: new Date() },
        usuario: { ativo: true },
      },
      include: { usuario: true },
    });

    if (!session) {
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }

    return this.toAuthenticatedUser(session.usuario, session.id);
  }

  private async createAccessToken(userId: string, sessionId: string) {
    return this.jwtService.signAsync<AccessTokenPayload>(
      { sub: userId, sid: sessionId },
      {
        secret: this.configService.get('auth.jwtSecret', { infer: true }),
        expiresIn: this.configService.get('auth.accessTokenTtlSeconds', {
          infer: true,
        }),
      },
    );
  }

  private createRefreshSecret() {
    return randomBytes(32).toString('base64url');
  }

  private parseRefreshToken(rawRefreshToken: string | undefined) {
    const [sessionId, secret, extra] = rawRefreshToken?.split('.') ?? [];

    if (!sessionId || !secret || extra) {
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }

    return { sessionId, secret };
  }

  private async hashIp(ip: string) {
    return argon2.hash(ip, { type: argon2.argon2id });
  }

  private toAuthenticatedUser(
    user: Usuario,
    sessionId: string,
  ): AuthenticatedUser {
    return {
      id: user.id,
      empresaId: user.empresaId,
      nome: user.nome,
      email: user.email,
      papel: user.papel,
      ativo: user.ativo,
      deveAlterarSenha: user.deveAlterarSenha,
      sessaoId: sessionId,
    };
  }
}
