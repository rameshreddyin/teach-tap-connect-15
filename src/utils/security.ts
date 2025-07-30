/**
 * Frontend security utilities for input validation and sanitization
 */

// Email validation with stricter regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Input sanitization - remove potentially harmful characters
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML injection attempts
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

// Safe localStorage operations with error handling
export const safeLocalStorageSetItem = (key: string, value: string): boolean => {
  try {
    if (typeof Storage !== 'undefined') {
      localStorage.setItem(key, value);
      return true;
    }
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
  return false;
};

export const safeLocalStorageGetItem = (key: string): string | null => {
  try {
    if (typeof Storage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
  }
  return null;
};

export const safeLocalStorageRemoveItem = (key: string): boolean => {
  try {
    if (typeof Storage !== 'undefined') {
      localStorage.removeItem(key);
      return true;
    }
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
  return false;
};

// Rate limiting for login attempts
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attemptData = this.attempts.get(identifier);

    if (!attemptData) {
      return true;
    }

    if (now > attemptData.resetTime) {
      this.attempts.delete(identifier);
      return true;
    }

    return attemptData.count < this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attemptData = this.attempts.get(identifier);

    if (!attemptData || now > attemptData.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
    } else {
      attemptData.count++;
    }
  }

  getRemainingTime(identifier: string): number {
    const attemptData = this.attempts.get(identifier);
    if (!attemptData) return 0;
    
    const remaining = Math.max(0, attemptData.resetTime - Date.now());
    return Math.ceil(remaining / 1000); // Return seconds
  }
}

export const loginRateLimiter = new RateLimiter();

// Environment-based credentials (for demo purposes)
export const getDemoCredentials = () => {
  // In a real app, these would come from environment variables or configuration
  return {
    email: "teacher@school.edu",
    password: "secure123"
  };
};

// Session management
export const createSession = (userData: any): string => {
  const sessionData = {
    user: userData,
    timestamp: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  const sessionToken = btoa(JSON.stringify(sessionData));
  safeLocalStorageSetItem('session_token', sessionToken);
  safeLocalStorageSetItem('user_authenticated', 'true');
  
  return sessionToken;
};

export const validateSession = (): boolean => {
  try {
    const sessionToken = safeLocalStorageGetItem('session_token');
    if (!sessionToken) return false;

    const sessionData = JSON.parse(atob(sessionToken));
    const now = Date.now();

    if (now > sessionData.expiresAt) {
      clearSession();
      return false;
    }

    return true;
  } catch (error) {
    clearSession();
    return false;
  }
};

export const clearSession = (): void => {
  safeLocalStorageRemoveItem('session_token');
  safeLocalStorageRemoveItem('user_authenticated');
};

// Content Security Policy helper
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};