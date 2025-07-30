import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateSession, clearSession, createSession, loginRateLimiter, getDemoCredentials } from '@/utils/security';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });
  const navigate = useNavigate();

  // Check authentication status on mount and periodically
  useEffect(() => {
    const checkAuth = () => {
      const isValid = validateSession();
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: isValid,
        isLoading: false
      }));

      if (!isValid && window.location.pathname !== '/login' && window.location.pathname !== '/') {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();

    // Check session validity periodically
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [navigate]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check rate limiting
    const clientId = 'login_attempts'; // In a real app, use IP or device fingerprint
    
    if (!loginRateLimiter.canAttempt(clientId)) {
      const remainingTime = loginRateLimiter.getRemainingTime(clientId);
      return {
        success: false,
        error: `Too many login attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`
      };
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const demoCredentials = getDemoCredentials();
      
      if (email === demoCredentials.email && password === demoCredentials.password) {
        const userData = {
          email: email,
          name: 'John Smith',
          id: 'teacher_001',
          role: 'teacher'
        };

        createSession(userData);
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: userData
        });

        return { success: true };
      } else {
        loginRateLimiter.recordAttempt(clientId);
        return {
          success: false,
          error: 'Invalid email or password. Please check your credentials and try again.'
        };
      }
    } catch (error) {
      loginRateLimiter.recordAttempt(clientId);
      return {
        success: false,
        error: 'Login failed due to a network error. Please try again.'
      };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null
    });
    navigate('/login', { replace: true });
  }, [navigate]);

  return {
    ...authState,
    login,
    logout
  };
};