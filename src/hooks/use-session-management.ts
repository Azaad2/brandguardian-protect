
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
    
    // Only auto logout after 2 hours of inactivity (much more reasonable)
    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      inactivityTimer = setTimeout(async () => {
        console.log('🚪 Auto logout due to inactivity (2 hours)');
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }, 2 * 60 * 60 * 1000); // 2 hours instead of 30 minutes
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
