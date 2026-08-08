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

  return config;
}
