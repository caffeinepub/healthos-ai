import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: '/' });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-900/50 dark:from-green-950/30 dark:to-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Welcome to HealthOS AI Premium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Premium Features Unlocked</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              You now have access to AI Medical Chat, Risk Detection, Health Vault, Fitness & Nutrition AI, and more!
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard in 5 seconds...
          </p>
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
