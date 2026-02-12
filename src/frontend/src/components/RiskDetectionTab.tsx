import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Lock, Sparkles } from 'lucide-react';

export default function RiskDetectionTab() {
  const isPremium = false;

  const riskCategories = [
    {
      name: 'Diabetes',
      risk: 'Low',
      score: 15,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      factors: ['Normal blood sugar', 'Healthy BMI', 'Regular exercise'],
    },
    {
      name: 'Hypertension',
      risk: 'Moderate',
      score: 45,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      factors: ['Slightly elevated BP', 'Family history', 'Moderate stress'],
    },
    {
      name: 'Heart Disease',
      risk: 'Low',
      score: 20,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      factors: ['Good cholesterol', 'Active lifestyle', 'No smoking'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Risk Detection & Prevention</h2>
          <p className="text-muted-foreground">AI-powered health risk assessment and preventive care</p>
        </div>
        {!isPremium && (
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            Premium Feature
          </Badge>
        )}
      </div>

      {!isPremium && (
        <Card className="border-primary bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Unlock Risk Detection</CardTitle>
            </div>
            <CardDescription>Get personalized health risk assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Upgrade to premium to access disease risk scoring, lifestyle risk assessment, and early warning system.
            </p>
            <Button>Upgrade to Premium</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Score</CardTitle>
          <CardDescription>Your comprehensive health risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">Low</div>
                <div className="text-sm text-muted-foreground">Risk</div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-medium">Lifestyle Score</p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={75} className="flex-1" />
                  <span className="text-sm text-muted-foreground">75/100</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Preventive Actions</p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={60} className="flex-1" />
                  <span className="text-sm text-muted-foreground">6/10</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {riskCategories.map((category) => (
          <Card key={category.name} className={isPremium ? '' : 'opacity-60'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{category.name}</CardTitle>
                <div className={`rounded-lg p-2 ${category.bgColor}`}>
                  <Shield className={`h-5 w-5 ${category.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Level</span>
                  <Badge variant="outline" className={category.color}>
                    {category.risk}
                  </Badge>
                </div>
                <Progress value={category.score} />
                <p className="mt-1 text-xs text-muted-foreground">{category.score}% risk score</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Key Factors</p>
                <ul className="space-y-1">
                  {category.factors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-600" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={isPremium ? '' : 'opacity-60'}>
        <CardHeader>
          <CardTitle>Preventive Action Plan</CardTitle>
          <CardDescription>Personalized recommendations to reduce your health risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border border-border p-4">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Monitor Blood Pressure Weekly</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track your blood pressure at least once per week to catch any concerning trends early.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={!isPremium}>
                Set Reminder
              </Button>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-border p-4">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Increase Physical Activity</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aim for 150 minutes of moderate exercise per week to improve cardiovascular health.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={!isPremium}>
                View Plan
              </Button>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-border p-4">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Reduce Sodium Intake</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Limit sodium to less than 2,300mg per day to help manage blood pressure.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={!isPremium}>
                Diet Tips
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
