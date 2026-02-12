import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Heart, Moon, Sparkles, Shield, BookOpen, Activity } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ConditionGuidanceDialog from './mental/condition-guidance/ConditionGuidanceDialog';

interface MentalHealthTabProps {
  onNavigateToTherapyPathway?: () => void;
  onNavigateToSleepAnalysis?: () => void;
  onNavigateToSettings?: () => void;
}

export default function MentalHealthTab({ 
  onNavigateToTherapyPathway, 
  onNavigateToSleepAnalysis,
  onNavigateToSettings 
}: MentalHealthTabProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const [showConditionGuidance, setShowConditionGuidance] = useState(false);

  if (!userProfile?.consentGiven) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Mental Health</h2>
          <p className="text-muted-foreground">Evidence-based mental health tools and tracking</p>
        </div>

        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <Shield className="h-5 w-5 text-amber-600" />
          <AlertDescription>
            <p className="font-semibold mb-2">Consent Required</p>
            <p className="text-sm mb-3">
              To use mental health features, please review and accept the consent terms in Settings.
            </p>
            <p className="text-xs text-muted-foreground">
              This application provides self-help tools and is not a substitute for professional mental health care.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Mental Health</h2>
        <p className="text-muted-foreground">Evidence-based mental health tools and tracking</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle>Mood & Stress</CardTitle>
            </div>
            <CardDescription>Track daily emotional patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Log your mood, stress levels, and emotional states to identify patterns over time.
            </p>
            <Button variant="outline" className="w-full">
              Log Today
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              <CardTitle>Sleep Monitoring</CardTitle>
            </div>
            <CardDescription>Analyze sleep patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track sleep quality and duration to understand your rest patterns.
            </p>
            <Button variant="outline" className="w-full">
              View Sleep Data
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {}}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Meditation</CardTitle>
            </div>
            <CardDescription>Guided mindfulness exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Practice mindfulness and meditation to reduce stress and improve focus.
            </p>
            <Button variant="outline" className="w-full">
              Start Session
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToTherapyPathway}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Therapy Pathway</CardTitle>
            </div>
            <CardDescription>Structured self-guided modules</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access evidence-based therapy modules including ACT, DBT, MBCT, and more.
            </p>
            <Button variant="outline" className="w-full">
              Explore Modules
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowConditionGuidance(true)}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Condition Guidance</CardTitle>
            </div>
            <CardDescription>Educational mental health resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get evidence-based guidance for specific mental health conditions.
            </p>
            <Button variant="outline" className="w-full">
              Browse Conditions
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToSleepAnalysis}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Sleep Analysis</CardTitle>
            </div>
            <CardDescription>Advanced sleep pattern insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze your sleep cycles and get personalized optimization suggestions.
            </p>
            <Button variant="outline" className="w-full">
              Analyze Sleep
            </Button>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Important:</strong> This application provides self-help tools and is not a substitute for professional mental health care. 
          If you're in crisis, please contact emergency services or a crisis hotline immediately.
        </AlertDescription>
      </Alert>

      <ConditionGuidanceDialog
        open={showConditionGuidance}
        onOpenChange={setShowConditionGuidance}
        onNavigateToSettings={onNavigateToSettings}
      />
    </div>
  );
}
