import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreateCheckoutSession, useIsStripeConfigured } from '../hooks/useQueries';
import { Check, Crown, Sparkles, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { ShoppingItem } from '../backend';
import StripeSetupModal from './StripeSetupModal';
import AdSenseBanner from './ads/AdSenseBanner';

export default function MembershipTab() {
  const { data: isStripeConfigured, isLoading: checkingStripe } = useIsStripeConfigured();
  const createCheckoutSession = useCreateCheckoutSession();
  const [showStripeSetup, setShowStripeSetup] = useState(false);

  // Mock membership status (backend doesn't support this yet)
  const isMember = false;
  const membershipExpiry = null;

  const handleUpgrade = async () => {
    if (!isStripeConfigured) {
      setShowStripeSetup(true);
      return;
    }

    const membershipItem: ShoppingItem = {
      productName: 'HealthOS AI Premium Membership',
      productDescription: '3-month premium access with AI insights, medical chat, and risk assessments',
      priceInCents: BigInt(2000), // $20.00
      currency: 'usd',
      quantity: BigInt(1),
    };

    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const session = await createCheckoutSession.mutateAsync({
        items: [membershipItem],
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-failure`,
      });
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = session.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error(error);
    }
  };

  const features = [
    { name: 'Smart Health Profile', free: true, premium: true },
    { name: 'Manual Vital Tracking', free: true, premium: true },
    { name: 'Basic Health Dashboard', free: true, premium: true },
    { name: 'AI Onboarding Interview', free: true, premium: true },
    { name: 'AI Medical Chat', free: false, premium: true },
    { name: 'Advanced AI Insights', free: false, premium: true },
    { name: 'Health Risk Scores', free: false, premium: true },
    { name: 'Personalized Recommendations', free: false, premium: true },
    { name: 'Priority Support', free: false, premium: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Membership</h2>
        <p className="text-muted-foreground">Unlock premium AI-powered health features</p>
      </div>

      {isMember && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-900/50 dark:from-green-950/30 dark:to-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-green-600 dark:text-green-400" />
                <CardTitle>Premium Member</CardTitle>
              </div>
              <Badge className="bg-green-600 text-white">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your membership is active until {membershipExpiry || 'N/A'}
            </p>
          </CardContent>
        </Card>
      )}

      {!isMember && (
        <AdSenseBanner
          adSlot="1234567890"
          className="w-full"
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>Basic health tracking features</CardDescription>
            <div className="pt-4">
              <div className="text-4xl font-bold text-foreground">$0</div>
              <p className="text-sm text-muted-foreground">Forever free</p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {features
                .filter((f) => f.free)
                .map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-foreground">{feature.name}</span>
                  </li>
                ))}
              {features
                .filter((f) => !f.free)
                .map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2 opacity-50">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{feature.name}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle>Premium Plan</CardTitle>
            </div>
            <CardDescription>Unlock all AI-powered features</CardDescription>
            <div className="pt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">$20</span>
                <span className="text-muted-foreground">/ 3 months</span>
              </div>
              <p className="text-sm text-muted-foreground">Just $6.67 per month</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">{feature.name}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleUpgrade}
              disabled={isMember || createCheckoutSession.isPending || checkingStripe}
              className="w-full"
              size="lg"
            >
              {createCheckoutSession.isPending
                ? 'Processing...'
                : isMember
                  ? 'Already a Member'
                  : 'Upgrade to Premium'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Premium Features Preview</CardTitle>
          <CardDescription>What you'll get with a premium membership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-foreground">AI Medical Chat</h4>
              <p className="text-sm text-muted-foreground">
                Get instant answers to your health questions from our AI assistant (placeholder)
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-foreground">Advanced AI Insights</h4>
              <p className="text-sm text-muted-foreground">
                Receive personalized health insights based on your data patterns (placeholder)
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-foreground">Health Risk Scores</h4>
              <p className="text-sm text-muted-foreground">
                Understand your risk factors for various health conditions (placeholder)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <StripeSetupModal open={showStripeSetup} onClose={() => setShowStripeSetup(false)} />
    </div>
  );
}
