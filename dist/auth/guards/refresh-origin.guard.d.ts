import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../config/app.config';
export declare class RefreshOriginGuard implements CanActivate {
    private readonly configService;
    constructor(configService: ConfigService<AppConfig, true>);
    canActivate(context: ExecutionContext): boolean;
}
