import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from('page_views').insert({
          path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
}
