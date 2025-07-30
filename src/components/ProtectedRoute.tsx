import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateSession } from '@/utils/security';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = validateSession();
      
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
    
    // Check authentication periodically
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, [navigate]);

  const isAuthenticated = validateSession();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};