import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TRACK_URL = 'https://flhqvkohslfxxfjzyzxy.supabase.co/functions/v1/track-visit';
const COOKIE_NAME = 'bndbox_email';
const SESSION_FLAG = 'bndbox_visit_tracked';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export function setKnownEmailCookie(email: string) {
  if (typeof document === 'undefined' || !email) return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(email.toLowerCase().trim())}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
}

export function useVisitTracker() {
  useEffect(() => {
    // Fire once per browser tab session
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_FLAG)) return;

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        const email = user?.email || getCookie(COOKIE_NAME);
        if (!email && !user?.id) return;

        if (email) setKnownEmailCookie(email);

        await fetch(TRACK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email || null,
            user_id: user?.id || null,
            path: window.location.pathname,
          }),
        });
        sessionStorage.setItem(SESSION_FLAG, '1');
      } catch (err) {
        // swallow — tracking must never break the UI
        console.debug('[visit-tracker]', err);
      }
    })();
  }, []);
}
