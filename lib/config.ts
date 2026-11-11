type AppConfig = {
  appName: string;
  apiBaseUrl: string;
  apiTimeout: number;
  isProduction: boolean;
};

const readEnv = (key: string): string | undefined => {
  const env =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as unknown as Record<string, string | undefined>)
      : undefined;

  if (env && typeof env[key] !== 'undefined') {
    return env[key];
  }

  const globalObject = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
    __APP_CONFIG__?: Record<string, string | undefined>;
  };

  if (globalObject.__APP_CONFIG__ && typeof globalObject.__APP_CONFIG__[key] !== 'undefined') {
    return globalObject.__APP_CONFIG__[key];
  }

  if (globalObject.process?.env && typeof globalObject.process.env[key] !== 'undefined') {
    return globalObject.process.env[key];
  }

  return undefined;
};

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value ?? '');
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config: AppConfig = {
  appName: readEnv('VITE_APP_NAME') ?? 'Puncia',
  apiBaseUrl: readEnv('VITE_API_URL') ?? 'http://localhost:3000',
  apiTimeout: toNumber(readEnv('VITE_API_TIMEOUT'), 15000),
  isProduction:
    (readEnv('NODE_ENV') ?? '').toLowerCase() === 'production' ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost'),
};

export const getConfig = (): AppConfig => config;

export default config;
