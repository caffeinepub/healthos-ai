import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Activity, Heart, TrendingUp, Shield, Dumbbell, Apple, Brain, Award, Flame, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function OverviewTab() {
  const { data: userProfile } = useGetCallerUserProfile();

  const mockHealthScore = 78;
  const mockStreak = 5;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-foreground">
          Welcome back, {userProfile?.displayName || 'User'}!
        </h2>
        <p className="text-muted-foreground">Here's your comprehensive health overview for today</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:border-blue-900/50 dark:from-blue-950/30 dark:to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Health Score</CardTitle>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{mockHealthScore}</div>
            <Progress value={mockHealthScore} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-900/50 dark:from-green-950/30 dark:to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Vitals Tracked</CardTitle>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">6</div>
            <p className="mt-2 text-xs text-muted-foreground">All vitals up to date</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:border-orange-900/50 dark:from-orange-950/30 dark:to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Health Streak</CardTitle>
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{mockStreak}</div>
            <p className="mt-2 text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:border-purple-900/50 dark:from-purple-950/30 dark:to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Membership</CardTitle>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="mb-2">
              Free Plan
            </Badge>
            <p className="text-xs text-muted-foreground">Upgrade for premium features</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Health Summary</CardTitle>
            <CardDescription>Your key health metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Heart Rate</p>
                  <p className="text-xs text-muted-foreground">72 bpm</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">Normal</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Blood Pressure</p>
                  <p className="text-xs text-muted-foreground">120/80 mmHg</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">Normal</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Risk Score</p>
                  <p className="text-xs text-muted-foreground">Low risk</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">Good</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Goals Progress</CardTitle>
            <CardDescription>Track your health objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  <span>Exercise</span>
                </div>
                <span className="text-muted-foreground">30/60 min</span>
              </div>
              <Progress value={50} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Apple className="h-4 w-4 text-primary" />
                  <span>Nutrition</span>
                </div>
                <span className="text-muted-foreground">1800/2000 cal</span>
              </div>
              <Progress value={90} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span>Mental Health</span>
                </div>
                <span className="text-muted-foreground">2/3 activities</span>
              </div>
              <Progress value={66} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your health milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <Award className="h-8 w-8 text-amber-600" />
              <div>
                <p className="font-medium">5 Day Streak</p>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">Goal Reached</p>
                <p className="text-xs text-muted-foreground">Weekly exercise</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">Improving</p>
                <p className="text-xs text-muted-foreground">Health score +3</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
