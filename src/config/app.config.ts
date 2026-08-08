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

export default (): AppConfig => ({
  app: {
    environment: (process.env.NODE_ENV ??
      'development') as AppConfig['app']['environment'],
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
