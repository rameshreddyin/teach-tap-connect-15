/**
 * Environment configuration utilities
 * Provides a safe way to handle environment-specific settings
 */

// Check if we're in development mode
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

// Check if we're in production mode
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

// Get application version
export const getAppVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0';
};

// Get base URL
export const getBaseUrl = (): string => {
  return import.meta.env.BASE_URL || '/';
};

// Safe console logging (only in development)
export const devLog = (...args: any[]): void => {
  if (isDevelopment()) {
    console.log('[DEV]', ...args);
  }
};

export const devError = (...args: any[]): void => {
  if (isDevelopment()) {
    console.error('[DEV ERROR]', ...args);
  }
};

export const devWarn = (...args: any[]): void => {
  if (isDevelopment()) {
    console.warn('[DEV WARN]', ...args);
  }
};

// Feature flags for production
export const getFeatureFlags = () => {
  return {
    enableAnalytics: isProduction(),
    enableDebugMode: isDevelopment(),
    enableErrorReporting: isProduction(),
    strictValidation: true,
  };
};