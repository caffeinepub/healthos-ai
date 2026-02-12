import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AdSenseBannerProps {
  adSlot: string;
  adClient?: string;
  className?: string;
}

export default function AdSenseBanner({ adSlot, adClient, className = '' }: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Get client ID from prop or environment variable
  const clientId = adClient || import.meta.env.VITE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    // Only initialize once and only if we have a client ID
    if (hasInitialized.current || !clientId || !adSlot) {
      return;
    }

    try {
      // Check if adsbygoogle is available
      if (window.adsbygoogle && adRef.current) {
        hasInitialized.current = true;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.warn('AdSense initialization failed:', error);
    }
  }, [clientId, adSlot]);

  // If no configuration, show placeholder
  if (!clientId || !adSlot) {
    return (
      <Card className={`border-dashed ${className}`}>
        <CardContent className="flex min-h-[250px] items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Ad Space</p>
            <p className="mt-1 text-xs">Configure AdSense to display ads</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div ref={adRef} className="min-h-[250px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={clientId}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </CardContent>
    </Card>
  );
}
