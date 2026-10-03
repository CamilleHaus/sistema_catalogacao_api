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
    /** Endereço S3 usado pela API para falar com o MinIO. */
    endpoint: string;
    /** Origem que o navegador usa para baixar o arquivo. */
    publicUrl: string;
    region: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    maxFileSizeBytes: number;
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
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT ?? '',
    publicUrl: (
      process.env.STORAGE_PUBLIC_URL ??
      process.env.STORAGE_ENDPOINT ??
      ''
    ).replace(/\/+$/, ''),
    region: process.env.STORAGE_REGION ?? 'us-east-1',
    bucket: process.env.STORAGE_BUCKET ?? '',
    accessKey: process.env.STORAGE_ACCESS_KEY ?? '',
    secretKey: process.env.STORAGE_SECRET_KEY ?? '',
    maxFileSizeBytes:
      Number(process.env.STORAGE_MAX_FILE_SIZE_MB ?? 10) * 1024 * 1024,
  },
});
