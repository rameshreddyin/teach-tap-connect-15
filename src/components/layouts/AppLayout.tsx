
import React, { Suspense } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Bell, List, LogOut } from 'lucide-react';
import ErrorBoundary from '../error-boundary';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Use React.memo to prevent unnecessary re-renders
const AppLayout: React.FC<AppLayoutProps> = React.memo(({ children }) => {
  const location = useLocation();
  const { logout } = useSecureAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="bg-background min-h-screen">
      {/* Logout button in top right */}
      <div className="fixed top-4 right-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Logout"
        >
          <LogOut size={16} />
        </Button>
      </div>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="p-4 flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        }>
          <main className="animate-fade-in pb-16">
            {children}
          </main>
        </Suspense>
      </ErrorBoundary>
      
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex justify-around items-center px-2 z-20 shadow-md animate-slide-in-up">
        <NavLink to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors ${isActive('/dashboard') ? 'text-foreground' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/dashboard') ? 'bg-accent' : ''} transition-all`}>
            <Home size={20} />
          </div>
          <span className="text-xs mt-0.5">Home</span>
        </NavLink>
        
        <NavLink to="/class-selection" className={`flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors ${isActive('/attendance') || isActive('/class-selection') ? 'text-foreground' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/attendance') || isActive('/class-selection') ? 'bg-accent' : ''} transition-all`}>
            <List size={20} />
          </div>
          <span className="text-xs mt-0.5">Attendance</span>
        </NavLink>
        
        <NavLink to="/announcements" className={`flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors ${isActive('/announcements') ? 'text-foreground' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/announcements') ? 'bg-accent' : ''} transition-all`}>
            <Bell size={20} />
          </div>
          <span className="text-xs mt-0.5">Notices</span>
        </NavLink>
        
        <NavLink to="/timetable" className={`flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors ${isActive('/timetable') ? 'text-foreground' : ''}`}>
          <div className={`p-1.5 rounded-full ${isActive('/timetable') ? 'bg-accent' : ''} transition-all`}>
            <Calendar size={20} />
          </div>
          <span className="text-xs mt-0.5">Timetable</span>
        </NavLink>
      </nav>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;
