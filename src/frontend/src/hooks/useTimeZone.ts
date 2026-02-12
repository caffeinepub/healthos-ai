import { useMemo } from 'react';

export function useTimeZone() {
  const detectedTimeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error('Failed to detect timezone:', error);
      return 'UTC';
    }
  }, []);

  return { detectedTimeZone };
}
