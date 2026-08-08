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
});
//# sourceMappingURL=app.config.js.map