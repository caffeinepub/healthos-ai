import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CBT_MODULES, DISTORTION_EDUCATION } from './cbt/modules';
import { computeProgressMetrics } from './cbt/computeProgressMetrics';
import { useGetInterventions, useGetJournalEntries, useGetDailyLogs } from '../../hooks/useQueries';
import { BookOpen, TrendingDown, Target, AlertCircle } from 'lucide-react';

export default function CbtWorkspaceTab() {
  const { data: interventions = [] } = useGetInterventions();
  const { data: journals = [] } = useGetJournalEntries();
  const { data: logs = [] } = useGetDailyLogs();

  const metrics = computeProgressMetrics(interventions, journals, logs);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">CBT Workspace</h2>
        <p className="text-muted-foreground">
          Cognitive Behavioral Therapy tools and progress tracking
        </p>
      </div>

      <Card className="border-amber-200 dark:border-amber-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle>Educational Content</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            This is not therapy. These tools are for self-help and education. Consult a licensed
            therapist for professional CBT treatment.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distortion Frequency</CardTitle>
            <CardDescription>Average per journal entry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {metrics.distortionFrequency.toFixed(1)}
            </div>
            <Progress value={Math.min(metrics.distortionFrequency * 20, 100)} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Belief Shift</CardTitle>
            <CardDescription>Average belief strength</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {metrics.beliefShiftAverage.toFixed(1)}/10
            </div>
            <Progress value={metrics.beliefShiftAverage * 10} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avoidance Behavior</CardTitle>
            <CardDescription>Lower is better</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {metrics.avoidanceBehaviorScore.toFixed(1)}/10
            </div>
            <Progress value={metrics.avoidanceBehaviorScore * 10} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CBT Modules</CardTitle>
          <CardDescription>Tools for cognitive restructuring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {CBT_MODULES.map((module) => (
              <div key={module.id} className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">{module.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                <Badge variant="outline" className="mt-3">
                  Coming Soon
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Cognitive Distortion Education</CardTitle>
          </div>
          <CardDescription>Learn to recognize common thinking errors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DISTORTION_EDUCATION.map((distortion, idx) => (
              <div key={idx} className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">{distortion.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{distortion.description}</p>
                <p className="mt-2 text-sm italic">Example: {distortion.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
