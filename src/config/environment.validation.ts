const environments = new Set(['development', 'test', 'production']);

export function validateEnvironment(config: Record<string, unknown>) {
  const environment =
    typeof config.NODE_ENV === 'string' ? config.NODE_ENV : 'development';
  const port = Number(config.PORT ?? 3001);
  const databaseUrl =
    typeof config.DATABASE_URL === 'string' ? config.DATABASE_URL : '';
  const webOrigin =
    typeof config.WEB_ORIGIN === 'string' ? config.WEB_ORIGIN : '';
  const jwtSecret =
    typeof config.JWT_SECRET === 'string' ? config.JWT_SECRET : '';
  const accessTokenTtlSeconds = Number(config.ACCESS_TOKEN_TTL_SECONDS ?? 900);
  const sessionTtlDays = Number(config.SESSION_TTL_DAYS ?? 30);
  const resetPassword =
    typeof config.RESET_PASSWORD === 'string' ? config.RESET_PASSWORD : '';
  const storageEndpoint =
    typeof config.STORAGE_ENDPOINT === 'string' ? config.STORAGE_ENDPOINT : '';
  const storagePublicUrl =
    typeof config.STORAGE_PUBLIC_URL === 'string'
      ? config.STORAGE_PUBLIC_URL
      : storageEndpoint;
  const storageBucket =
    typeof config.STORAGE_BUCKET === 'string' ? config.STORAGE_BUCKET : '';
  const storageAccessKey =
    typeof config.STORAGE_ACCESS_KEY === 'string'
      ? config.STORAGE_ACCESS_KEY
      : '';
  const storageSecretKey =
    typeof config.STORAGE_SECRET_KEY === 'string'
      ? config.STORAGE_SECRET_KEY
      : '';
  const storageMaxFileSizeMb = Number(config.STORAGE_MAX_FILE_SIZE_MB ?? 10);

  if (!environments.has(environment)) {
    throw new Error('NODE_ENV deve ser development, test ou production.');
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT deve ser uma porta TCP válida.');
  }

  if (!databaseUrl.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL deve ser uma URL PostgreSQL válida.');
  }

  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET deve possuir pelo menos 32 caracteres.');
  }

  if (!Number.isInteger(accessTokenTtlSeconds) || accessTokenTtlSeconds < 60) {
    throw new Error(
      'ACCESS_TOKEN_TTL_SECONDS deve ser um inteiro de ao menos 60.',
    );
  }

  if (
    !Number.isInteger(sessionTtlDays) ||
    sessionTtlDays < 1 ||
    sessionTtlDays > 30
  ) {
    throw new Error('SESSION_TTL_DAYS deve ser um inteiro entre 1 e 30.');
  }

  if (resetPassword.length < 8) {
    throw new Error('RESET_PASSWORD deve possuir pelo menos 8 caracteres.');
  }

  try {
    const origin = new URL(webOrigin);

    if (
      !['http:', 'https:'].includes(origin.protocol) ||
      origin.origin !== webOrigin
    ) {
      throw new Error();
    }
  } catch {
    throw new Error(
      'WEB_ORIGIN deve conter uma origem HTTP válida, sem caminho.',
    );
  }

  requireHttpUrl(storageEndpoint, 'STORAGE_ENDPOINT');
  requireHttpUrl(storagePublicUrl, 'STORAGE_PUBLIC_URL');

  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(storageBucket)) {
    throw new Error('STORAGE_BUCKET deve ser um nome de bucket S3 válido.');
  }

  if (!storageAccessKey || !storageSecretKey) {
    throw new Error(
      'STORAGE_ACCESS_KEY e STORAGE_SECRET_KEY são obrigatórias.',
    );
  }

  if (
    !Number.isFinite(storageMaxFileSizeMb) ||
    storageMaxFileSizeMb < 1 ||
    storageMaxFileSizeMb > 100
  ) {
    throw new Error('STORAGE_MAX_FILE_SIZE_MB deve estar entre 1 e 100.');
  }

  return config;
}

function requireHttpUrl(value: string, name: string) {
  try {
    const url = new URL(value);

    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error(`${name} deve conter uma URL HTTP válida.`);
  }
}
