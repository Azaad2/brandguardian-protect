
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const useSessionManagement = (userRole: UserRole | null) => {
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    // Auto logout after 4 hours of inactivity (even more reasonable for all users)
    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      inactivityTimer = setTimeout(async () => {
        console.log('🚪 Auto logout due to inactivity (4 hours)');
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }, 4 * 60 * 60 * 1000); // 4 hours of inactivity
    };

    // Events that reset the inactivity timer
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Add activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Start the inactivity timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [userRole]);
};
