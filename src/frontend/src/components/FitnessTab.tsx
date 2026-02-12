import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dumbbell, TrendingUp, Activity, Clock, Target, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function FitnessTab() {
  const [isLogging, setIsLogging] = useState(false);
  const isPremium = false;

  const mockWorkouts = [
    { id: '1', name: 'Morning Run', duration: 30, calories: 250, date: '2026-01-02' },
    { id: '2', name: 'Strength Training', duration: 45, calories: 320, date: '2026-01-01' },
    { id: '3', name: 'Yoga Session', duration: 60, calories: 180, date: '2025-12-31' },
  ];

  const handleLogActivity = () => {
    setIsLogging(true);
    setTimeout(() => {
      toast.success('Activity logged successfully');
      setIsLogging(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Fitness & Physical Health</h2>
          <p className="text-muted-foreground">Track your workouts and physical activity</p>
        </div>
        {!isPremium && (
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            AI Features Premium
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Daily Steps</CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7,842</div>
            <Progress value={78} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Goal: 10,000 steps</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Active Minutes</CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <Progress value={75} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Goal: 60 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Calories Burned</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">520</div>
            <p className="mt-2 text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Weekly Goal</CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4/5</div>
            <Progress value={80} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Workouts completed</p>
          </CardContent>
        </Card>
      </div>

      {!isPremium && (
        <Card className="border-primary bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Unlock AI Workout Planner</CardTitle>
            </div>
            <CardDescription>Get personalized workout plans tailored to your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <img
                src="/assets/generated/fitness-trainer.dim_600x400.png"
                alt="AI Fitness Trainer"
                className="h-24 w-32 rounded-lg object-cover"
              />
              <p className="text-sm text-muted-foreground">
                Upgrade to premium for AI-powered workout plans, exercise recommendations, and progress tracking.
              </p>
            </div>
            <Button>Upgrade to Premium</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Your recent workouts and exercises</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Log Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Workout Activity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="activityName">Activity Name</Label>
                      <Input id="activityName" placeholder="e.g., Morning Run, Gym Session" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input id="duration" type="number" placeholder="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="calories">Calories Burned</Label>
                        <Input id="calories" type="number" placeholder="250" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea id="notes" placeholder="How did you feel? Any achievements?" rows={3} />
                    </div>
                    <Button onClick={handleLogActivity} disabled={isLogging} className="w-full">
                      {isLogging ? 'Logging...' : 'Log Activity'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{workout.duration} min</span>
                        <span>•</span>
                        <span>{workout.calories} cal</span>
                        <span>•</span>
                        <span>{workout.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className={isPremium ? '' : 'opacity-60'}>
            <CardHeader>
              <CardTitle className="text-base">AI Workout Plan</CardTitle>
              <CardDescription>Personalized for your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium">Today's Workout</p>
                <p className="mt-1 text-xs text-muted-foreground">Upper Body Strength</p>
                <p className="mt-1 text-xs text-muted-foreground">45 minutes • Intermediate</p>
              </div>
              <Button variant="outline" className="w-full" disabled={!isPremium}>
                View Full Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">This Week</span>
                <span className="font-medium">4 workouts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Time</span>
                <span className="font-medium">180 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. Intensity</span>
                <span className="font-medium">Moderate</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
