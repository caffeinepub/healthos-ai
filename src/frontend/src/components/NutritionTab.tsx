import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Apple, Camera, Plus, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function NutritionTab() {
  const [isLogging, setIsLogging] = useState(false);
  const isPremium = false;

  const dailyGoals = {
    calories: { current: 1520, target: 2000 },
    protein: { current: 65, target: 100 },
    carbs: { current: 180, target: 250 },
    fats: { current: 45, target: 65 },
  };

  const mockMeals = [
    { id: '1', name: 'Breakfast - Oatmeal & Fruits', calories: 350, time: '08:00 AM' },
    { id: '2', name: 'Lunch - Grilled Chicken Salad', calories: 520, time: '12:30 PM' },
    { id: '3', name: 'Snack - Greek Yogurt', calories: 150, time: '03:00 PM' },
    { id: '4', name: 'Dinner - Salmon & Vegetables', calories: 500, time: '07:00 PM' },
  ];

  const handleLogFood = () => {
    setIsLogging(true);
    setTimeout(() => {
      toast.success('Food logged successfully');
      setIsLogging(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Nutrition & Diet Management</h2>
          <p className="text-muted-foreground">Track your meals and nutritional intake</p>
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
            <CardTitle className="text-base">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dailyGoals.calories.current}</div>
            <Progress value={(dailyGoals.calories.current / dailyGoals.calories.target) * 100} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Goal: {dailyGoals.calories.target} kcal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dailyGoals.protein.current}g</div>
            <Progress value={(dailyGoals.protein.current / dailyGoals.protein.target) * 100} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Goal: {dailyGoals.protein.target}g</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dailyGoals.carbs.current}g</div>
            <Progress value={(dailyGoals.carbs.current / dailyGoals.carbs.target) * 100} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Goal: {dailyGoals.carbs.target}g</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Fats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dailyGoals.fats.current}g</div>
            <Progress value={(dailyGoals.fats.current / dailyGoals.fats.target) * 100} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Goal: {dailyGoals.fats.target}g</p>
          </CardContent>
        </Card>
      </div>

      {!isPremium && (
        <Card className="border-primary bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Unlock AI Diet Planner</CardTitle>
            </div>
            <CardDescription>Get personalized meal plans based on your health goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4">
              <img
                src="/assets/generated/meal-prep.dim_600x400.png"
                alt="Meal Planning"
                className="h-24 w-32 rounded-lg object-cover"
              />
              <p className="text-sm text-muted-foreground">
                Upgrade to premium for AI-powered meal plans, food scanning, and nutritional analysis.
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
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>Your food log for today</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={!isPremium}>
                      <Camera className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Scan Food</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border">
                        <div className="text-center">
                          <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">Camera preview would appear here</p>
                        </div>
                      </div>
                      <Button className="w-full" disabled>
                        Capture & Analyze
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Log Food
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Food Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="foodName">Food Name</Label>
                        <Input id="foodName" placeholder="e.g., Grilled Chicken Breast" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="calories">Calories</Label>
                          <Input id="calories" type="number" placeholder="250" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="serving">Serving Size</Label>
                          <Input id="serving" placeholder="1 cup" />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="protein">Protein (g)</Label>
                          <Input id="protein" type="number" placeholder="30" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carbs">Carbs (g)</Label>
                          <Input id="carbs" type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fats">Fats (g)</Label>
                          <Input id="fats" type="number" placeholder="5" />
                        </div>
                      </div>
                      <Button onClick={handleLogFood} disabled={isLogging} className="w-full">
                        {isLogging ? 'Logging...' : 'Log Food'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Apple className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{meal.calories} kcal</span>
                        <span>•</span>
                        <span>{meal.time}</span>
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
              <CardTitle className="text-base">AI Meal Plan</CardTitle>
              <CardDescription>Personalized for your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium">Tomorrow's Plan</p>
                <p className="mt-1 text-xs text-muted-foreground">High Protein, Low Carb</p>
                <p className="mt-1 text-xs text-muted-foreground">2000 kcal • 150g protein</p>
              </div>
              <Button variant="outline" className="w-full" disabled={!isPremium}>
                View Full Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. Calories</span>
                <span className="font-medium">1,850 kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Protein Avg.</span>
                <span className="font-medium">85g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Meals Logged</span>
                <span className="font-medium">21/21</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
