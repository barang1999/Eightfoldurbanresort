import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
        localStorage.setItem('sessionId', sessionId);

        const propertyId = localStorage.getItem('propertyId') || import.meta.env.VITE_DEFAULT_PROPERTY_ID;

        await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: location.pathname,
            referrer: document.referrer,
            sessionId,
            propertyId,
          }),
        });
      } catch (err) {
        console.error('❌ Tracking failed:', err);
      }
    };

    trackVisit();
  }, [location.pathname]);
};