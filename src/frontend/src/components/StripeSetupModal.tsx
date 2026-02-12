import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StripeSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StripeSetupModal({ open, onClose }: StripeSetupModalProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    if (!actor) {
      toast.error('Actor not available');
      return;
    }

    setIsSubmitting(true);

    try {
      const countryList = countries
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length === 2);

      await actor.setStripeConfiguration({
        secretKey: secretKey.trim(),
        allowedCountries: countryList,
      });

      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
      toast.success('Stripe configured successfully!');
      onClose();
      setSecretKey('');
      setCountries('US,CA,GB');
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Stripe Payment</DialogTitle>
          <DialogDescription>Set up Stripe to enable premium membership payments</DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Admin only: Enter your Stripe secret key to enable payments. Get your key from the Stripe Dashboard.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              placeholder="US,CA,GB"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Use 2-letter country codes (e.g., US, CA, GB)</p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Configuring...' : 'Configure Stripe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
