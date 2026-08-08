import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AppConfig } from '../config/app.config';
import { PrismaService } from '../database/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser } from './auth.types';
interface SessionContext {
    userAgent?: string;
    ip?: string;
}
export declare class AuthService implements OnModuleInit {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private dummyPasswordHash;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService<AppConfig, true>);
    onModuleInit(): Promise<void>;
    login(dto: LoginDto, context: SessionContext): Promise<{
        accessToken: string;
        refreshToken: string;
        usuario: AuthenticatedUser;
    }>;
    refresh(rawRefreshToken: string | undefined): Promise<{
        accessToken: string;
        refreshToken: string;
        usuario: AuthenticatedUser;
    }>;
    logout(user: AuthenticatedUser): Promise<void>;
    changeRequiredPassword(user: AuthenticatedUser, newPassword: string): Promise<AuthenticatedUser>;
    authenticateAccessToken(token: string): Promise<AuthenticatedUser>;
    private createAccessToken;
    private createRefreshSecret;
    private parseRefreshToken;
    private hashIp;
    private toAuthenticatedUser;
}
export {};
