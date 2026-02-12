import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBreathingTimer } from './breathing/useBreathingTimer';
import { Wind, AlertCircle, Coffee, Moon, Users } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AcuteModeTab() {
  const { state, start, stop } = useBreathingTimer(2);

  const protocols = [
    {
      id: 'panic',
      name: 'Panic Attack Protocol',
      icon: AlertCircle,
      steps: [
        'Find a safe, quiet place',
        'Focus on your breathing',
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
      ],
    },
    {
      id: 'anger',
      name: 'Anger Cooldown',
      icon: Coffee,
      steps: [
        'Step away from the situation',
        'Take 10 deep breaths',
        'Count backwards from 100 by 7s',
        'Splash cold water on your face',
        'Write down what you\'re feeling',
      ],
    },
    {
      id: 'meeting',
      name: 'Meeting Anxiety Primer',
      icon: Users,
      steps: [
        'Arrive 5 minutes early',
        'Practice box breathing (4-4-4-4)',
        'Review your talking points',
        'Remember: everyone is human',
        'Focus on listening, not performing',
      ],
    },
    {
      id: 'sleep',
      name: 'Sleep Reset Protocol',
      icon: Moon,
      steps: [
        'Turn off all screens',
        'Dim the lights',
        'Practice progressive muscle relaxation',
        'Use 4-7-8 breathing',
        'Visualize a peaceful scene',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Acute Intervention Mode</h2>
        <p className="text-muted-foreground">Quick tools for immediate stress relief</p>
      </div>

      <Card className="border-red-200 dark:border-red-900/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-600">Need urgent help?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                If you're in crisis, visit the Crisis Safety tab for immediate resources.
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a href="#crisis">Go to Crisis Support</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            <CardTitle>2-Minute Breathing Stabilizer</CardTitle>
          </div>
          <CardDescription>Guided breathing exercise to calm your nervous system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="mb-4 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{state.secondsRemaining}</p>
                <p className="text-sm text-muted-foreground capitalize">{state.phase}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Cycle {state.cyclesCompleted + 1} of {Math.floor(120 / 16)}
            </p>
            <Progress
              value={((state.cyclesCompleted + 1) / Math.floor(120 / 16)) * 100}
              className="mt-4"
            />
          </div>
          <div className="flex gap-2">
            {!state.isActive ? (
              <Button onClick={start} className="flex-1">
                Start Breathing Exercise
              </Button>
            ) : (
              <Button onClick={stop} variant="outline" className="flex-1">
                Stop
              </Button>
            )}
          </div>
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-semibold">Instructions:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Inhale: Breathe in slowly through your nose (4 seconds)</li>
              <li>• Hold: Hold your breath gently (4 seconds)</li>
              <li>• Exhale: Breathe out slowly through your mouth (6 seconds)</li>
              <li>• Rest: Pause before the next cycle (2 seconds)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {protocols.map((protocol) => {
          const Icon = protocol.icon;
          return (
            <Card key={protocol.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{protocol.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  {protocol.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-2">
                      <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                        {idx + 1}
                      </Badge>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
