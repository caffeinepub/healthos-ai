import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Activity, Shield, TrendingUp, Heart } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 shadow-lg">
              <Activity className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-2 text-5xl font-bold text-foreground">HealthOS AI</h1>
            <p className="text-xl text-muted-foreground">Your Intelligent Health Management Platform</p>
          </div>

          <div className="mb-12 overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="/assets/generated/dashboard-hero.dim_800x600.png"
              alt="Health Dashboard"
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">Smart Health Profile</h3>
              <p className="text-sm text-muted-foreground">
                Track your vitals, lifestyle, and health goals in one secure place
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized health scores and recommendations based on your data
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your health data is encrypted and stored securely on the blockchain
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="h-14 px-12 text-lg font-semibold shadow-lg transition-all hover:scale-105"
            >
              {isLoggingIn ? 'Connecting...' : 'Get Started'}
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Secure login powered by Internet Identity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
