"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    app: {
        environment: (process.env.NODE_ENV ??
            'development'),
        port: Number(process.env.PORT ?? 3001),
        webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    },
    database: {
        url: process.env.DATABASE_URL ?? '',
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET ?? '',
        accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900),
        sessionTtlDays: Number(process.env.SESSION_TTL_DAYS ?? 30),
        resetPassword: process.env.RESET_PASSWORD ?? '',
    },
    storage: {
        endpoint: process.env.STORAGE_ENDPOINT ?? '',
        publicUrl: (process.env.STORAGE_PUBLIC_URL ??
            process.env.STORAGE_ENDPOINT ??
            '').replace(/\/+$/, ''),
        region: process.env.STORAGE_REGION ?? 'us-east-1',
        bucket: process.env.STORAGE_BUCKET ?? '',
        accessKey: process.env.STORAGE_ACCESS_KEY ?? '',
        secretKey: process.env.STORAGE_SECRET_KEY ?? '',
        maxFileSizeBytes: Number(process.env.STORAGE_MAX_FILE_SIZE_MB ?? 10) * 1024 * 1024,
    },
});
//# sourceMappingURL=app.config.js.map