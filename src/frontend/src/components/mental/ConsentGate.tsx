import { ReactNode } from 'react';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import ConsentScreen from './ConsentScreen';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ConsentGateProps {
  children: ReactNode;
}

export default function ConsentGate({ children }: ConsentGateProps) {
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile?.consentGiven) {
    return <ConsentScreen />;
  }

  return <>{children}</>;
}
