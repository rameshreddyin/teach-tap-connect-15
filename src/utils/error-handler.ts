/**
 * Global error handling utilities
 */

import { isProduction, devError } from './environment';

// Safe error logging
export const logError = (error: Error | unknown, context?: string): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Log detailed errors only in development
  if (!isProduction()) {
    devError(`Error in ${context || 'Unknown context'}:`, {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
  }
  
  // In production, you might want to send to an error reporting service
  // Example: Sentry, LogRocket, etc.
  if (isProduction()) {
    // sendToErrorReporting({ message: errorMessage, context });
  }
};

// Safe promise handler
export const safePromise = async <T>(
  promise: Promise<T>,
  context?: string
): Promise<[T | null, Error | null]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    logError(error, context);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
};

// Safe function execution
export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  context?: string
): T => {
  try {
    return fn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
};

// Generic error boundary helper
export class AppError extends Error {
  public readonly context?: string;
  public readonly userMessage: string;

  constructor(message: string, userMessage?: string, context?: string) {
    super(message);
    this.name = 'AppError';
    this.userMessage = userMessage || 'An unexpected error occurred';
    this.context = context;
  }
}