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
    storage: {
        endpoint: string;
        publicUrl: string;
        region: string;
        bucket: string;
        accessKey: string;
        secretKey: string;
        maxFileSizeBytes: number;
    };
}
declare const _default: () => AppConfig;
export default _default;
