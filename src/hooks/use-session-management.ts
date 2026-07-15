
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const useSessionManagement = (userRole: UserRole | null) => {
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;
    let warningTimer: ReturnType<typeof setTimeout>;
    
    // Auto logout after 3.5 hours of inactivity
    const INACTIVITY_TIMEOUT = 3.5 * 60 * 60 * 1000; // 3.5 hours
    const WARNING_BEFORE_LOGOUT = 5 * 60 * 1000; // 5 minutes warning
    
    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
      
      // Console warning 5 minutes before logout
      warningTimer = setTimeout(() => {
        console.warn('⚠️ Session expiring soon - 5 minutes remaining');
      }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT);
      
      inactivityTimer = setTimeout(async () => {
        console.log('🚪 Auto logout due to inactivity (3.5 hours)');
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }, INACTIVITY_TIMEOUT);
    };

    // Events that reset the inactivity timer
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Add activity listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Start the inactivity timer
    resetInactivityTimer();

    // Periodic session validity check (every 5 minutes)
    const sessionCheckInterval = setInterval(async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.log('❌ Session check failed - logging out');
        clearInterval(sessionCheckInterval);
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      } else {
        console.log('✅ Session check passed');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
      clearInterval(sessionCheckInterval);
    };
  }, [userRole]);
};
