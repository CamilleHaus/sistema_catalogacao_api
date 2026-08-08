export interface AppConfig {
    app: {
        environment: 'development' | 'test' | 'production';
        port: number;
        webOrigin: string;
    };
    database: {
        url: string;
    };
    auth: {
        jwtSecret: string;
        accessTokenTtlSeconds: number;
        sessionTtlDays: number;
        resetPassword: string;
    };
}
declare const _default: () => AppConfig;
export default _default;
