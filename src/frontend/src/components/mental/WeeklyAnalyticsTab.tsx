import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGetWeeklyAnalytics, useGetWeeklyLogs } from '../../hooks/useQueries';
import { interpretCorrelation } from './analytics/computeWeeklyAnalytics';
import { AlertCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function WeeklyAnalyticsTab() {
  const { data: analytics, isLoading } = useGetWeeklyAnalytics();
  const { data: logs = [] } = useGetWeeklyLogs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground">No Data Yet</h3>
        <p className="mt-2 text-muted-foreground">
          Start logging your daily mood and behavior to see analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Weekly Analytics</h2>
        <p className="text-muted-foreground">
          Insights from your last {logs.length} day{logs.length !== 1 ? 's' : ''} of tracking
        </p>
      </div>

      <Card className="border-amber-200 dark:border-amber-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle>Disclaimer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            These metrics are informational and non-diagnostic. They are based on your self-reported
            data and deterministic calculations. Consult a mental health professional for clinical
            assessment.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stress Load Score</CardTitle>
            <CardDescription>Average stress level (1-10)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {analytics.stressLoad.toFixed(1)}/10
            </div>
            <Progress value={analytics.stressLoad * 10} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Burnout Index</CardTitle>
            <CardDescription>Work exhaustion indicator (0-100%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {(analytics.burnoutIndex * 100).toFixed(0)}%
            </div>
            <Progress value={analytics.burnoutIndex * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Emotional Stability</CardTitle>
            <CardDescription>Average mood score (1-10)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {analytics.emotionalStability.toFixed(1)}/10
            </div>
            <Progress value={analytics.emotionalStability * 10} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cognitive Fatigue</CardTitle>
            <CardDescription>Mental energy depletion (0-100%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {(analytics.cognitiveFatigue * 100).toFixed(0)}%
            </div>
            <Progress value={analytics.cognitiveFatigue * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sleep–Mood Correlation</CardTitle>
            <CardDescription>Average sleep hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {analytics.sleepMoodCorrelation.toFixed(1)}h
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Correlation: {interpretCorrelation(analytics.sleepMoodCorrelation / 10)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mood Volatility Index</CardTitle>
            <CardDescription>Emotional fluctuation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {analytics.moodVolatility.toFixed(2)}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {analytics.moodVolatility < 1.5 ? 'Stable' : analytics.moodVolatility < 2.5 ? 'Moderate' : 'High'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Risk Forecast</CardTitle>
          <CardDescription>
            Rule-based prediction of potential stress/burnout risk (informational only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">
              {(analytics.riskForecast * 100).toFixed(0)}%
            </div>
            <div className="flex-1">
              <Progress value={analytics.riskForecast * 100} className="mb-2" />
              <div className="flex items-center gap-2 text-sm">
                {analytics.riskForecast < 0.3 ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Low risk</span>
                  </>
                ) : analytics.riskForecast < 0.6 ? (
                  <>
                    <Activity className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-600">Moderate risk</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Elevated risk</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This forecast is based on your recent stress, burnout, and cognitive fatigue scores. It
            is not a clinical prediction. If you're concerned, please seek professional support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
