import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Moon, TrendingUp, AlertCircle } from 'lucide-react';
import { useGetSleepEstimatorRuns } from '../../../hooks/useQueries';
import { convertFromBackendRun, UIReportModel } from './sleepRunAdapters';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SleepEstimatorHistoryProps {
  onBack: () => void;
}

export default function SleepEstimatorHistory({ onBack }: SleepEstimatorHistoryProps) {
  const { data: runs, isLoading } = useGetSleepEstimatorRuns();
  const [selectedRun, setSelectedRun] = useState<UIReportModel | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  if (selectedRun) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedRun(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Sleep Analysis Report</h2>
            <p className="text-sm text-muted-foreground">
              {selectedRun.runTimestamp.toLocaleDateString()} at {selectedRun.runTimestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Data stored:</strong> This analysis uses behavioral phone-usage metadata and derived metrics only. No content is captured.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Analysis Summary (Last {selectedRun.daysAnalyzed} Days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Sleep Onset</p>
                <p className="text-2xl font-bold">{selectedRun.output.averageSleepOnset}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Wake Time</p>
                <p className="text-2xl font-bold">{selectedRun.output.averageWakeTime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Duration</p>
                <p className="text-2xl font-bold">{selectedRun.output.averageDuration}h</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Consistency Score</p>
                <p className="text-2xl font-bold">{selectedRun.output.sleepConsistencyScore}/100</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Circadian Stability</p>
                <Badge variant={selectedRun.output.circadianStability === 'Stable' ? 'default' : 'outline'}>
                  {selectedRun.output.circadianStability}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Estimated Chronotype</p>
                <p className="font-medium">{selectedRun.output.estimatedChronotype}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sleep Debt</p>
                <p className="font-medium">
                  {selectedRun.output.sleepDebt > 0 ? '+' : ''}
                  {selectedRun.output.sleepDebt}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedRun.output.riskIndicators.length > 0 && (
          <Card className="border-amber-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Risk Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedRun.output.riskIndicators.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {selectedRun.output.optimizationSuggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {selectedRun.output.optimizationSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-primary">{idx + 1}.</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              Sleep estimates are behavioral approximations derived from phone usage patterns and are not a medical assessment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Input
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sleep Analysis History</h2>
          <p className="text-sm text-muted-foreground">View your previous sleep analysis runs</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Data stored:</strong> Your sleep analysis history includes behavioral metadata and derived metrics only. No content is captured.
        </AlertDescription>
      </Alert>

      {!runs || runs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Moon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No sleep analysis runs yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete an analysis to see it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {runs.map((run, idx) => {
            const uiRun = convertFromBackendRun(run);
            return (
              <Card key={idx} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedRun(uiRun)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">
                          {uiRun.runTimestamp.toLocaleDateString()}
                        </CardTitle>
                        <CardDescription>
                          {uiRun.runTimestamp.toLocaleTimeString()} • {uiRun.daysAnalyzed} days analyzed
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">
                      Score: {uiRun.output.sleepConsistencyScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg Duration</p>
                      <p className="font-medium">{uiRun.output.averageDuration}h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sleep Debt</p>
                      <p className="font-medium">
                        {uiRun.output.sleepDebt > 0 ? '+' : ''}
                        {uiRun.output.sleepDebt}h
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Chronotype</p>
                      <p className="font-medium">{uiRun.output.estimatedChronotype}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm font-medium">
            Sleep estimates are behavioral approximations derived from phone usage patterns and are not a medical assessment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
