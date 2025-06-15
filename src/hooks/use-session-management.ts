
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const useSessionManagement = (userRole: UserRole | null) => {
  useEffect(() => {
    // Don't apply aggressive session management for admin users
    if (userRole === 'admin') {
      console.log('🔧 Admin user detected - skipping aggressive session management');
      return;
    }

    let inactivityTimer: NodeJS.Timeout;
    
    // Auto logout on browser/tab close or navigation away
    const handleBeforeUnload = async () => {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
    };

    // Auto logout on page hide (when tab becomes inactive)
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
      }
    };

    // Auto logout after 30 minutes of inactivity
    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      inactivityTimer = setTimeout(async () => {
        console.log('🚪 Auto logout due to inactivity');
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Events that reset the inactivity timer
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Start the inactivity timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [userRole]);
};
