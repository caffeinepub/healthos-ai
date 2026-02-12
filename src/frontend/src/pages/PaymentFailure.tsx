import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-red-200 bg-gradient-to-br from-red-50 to-white dark:border-red-900/50 dark:from-red-950/30 dark:to-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>Your payment was not completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't worry, no charges were made to your account. You can try again whenever you're ready.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
