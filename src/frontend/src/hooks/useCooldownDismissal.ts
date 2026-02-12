import { useState, useEffect } from 'react';

interface UseCooldownDismissalOptions {
  key: string;
  cooldownDays?: number;
}

export function useCooldownDismissal({ key, cooldownDays = 7 }: UseCooldownDismissalOptions) {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const dismissalKey = `dismissal_${key}`;
    const storedTimestamp = localStorage.getItem(dismissalKey);
    
    if (storedTimestamp) {
      const dismissedAt = parseInt(storedTimestamp, 10);
      const now = Date.now();
      const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
      
      if (now - dismissedAt < cooldownMs) {
        setIsDismissed(true);
      } else {
        // Cooldown expired, clear the dismissal
        localStorage.removeItem(dismissalKey);
      }
    }
  }, [key, cooldownDays]);

  const dismiss = () => {
    const dismissalKey = `dismissal_${key}`;
    localStorage.setItem(dismissalKey, Date.now().toString());
    setIsDismissed(true);
  };

  return { isDismissed, dismiss };
}
