import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import type { AppConfig } from '../config/app.config';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService<AppConfig, true>);
    login(dto: LoginDto, request: Request, response: Response): Promise<{
        accessToken: string;
        usuario: import("./auth.types").AuthenticatedUser;
    }>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
        usuario: import("./auth.types").AuthenticatedUser;
    }>;
    logout(request: AuthenticatedRequest, response: Response): Promise<void>;
    me(request: AuthenticatedRequest): import("./auth.types").AuthenticatedUser;
    changePassword(request: AuthenticatedRequest, dto: ChangePasswordDto): Promise<import("./auth.types").AuthenticatedUser>;
    private readRefreshCookie;
    private setRefreshCookie;
    private cookieOptions;
}
