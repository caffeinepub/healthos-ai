import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, TrendingUp, AlertCircle, Moon, Save } from 'lucide-react';
import { SleepAnalysisOutput } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { buildMLExport, downloadMLExport } from './exportForML';
import { useSaveSleepEstimatorRun } from '../../../hooks/useQueries';
import { convertToBackendRun } from './sleepRunAdapters';
import { toast } from 'sonner';
import { useGetCallerUserProfile } from '../../../hooks/useQueries';
import { useState, useEffect } from 'react';

interface SleepEstimatorReportProps {
  result: SleepAnalysisOutput;
  onBack: () => void;
  input?: { days: any[]; timeZone: string };
  isSavedRun?: boolean;
}

export default function SleepEstimatorReport({ result, onBack, input, isSavedRun = false }: SleepEstimatorReportProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveSleepRun = useSaveSleepEstimatorRun();
  const [hasSaved, setHasSaved] = useState(isSavedRun);

  const isAuthenticated = !!userProfile;
  const hasConsent = userProfile?.consentGiven || false;
  const canSave = isAuthenticated && hasConsent && !hasSaved;

  useEffect(() => {
    // Auto-save on mount if conditions are met and input is available
    if (canSave && input && !isSavedRun) {
      handleSave();
    }
  }, []); // Only run once on mount

  const handleExportML = () => {
    if (!input) {
      toast.error('Cannot export: input data not available');
      return;
    }

    const mlData = buildMLExport(input, result);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadMLExport(mlData, `sleep-ml-export-${timestamp}.json`);
    toast.success('ML export downloaded');
  };

  const handleSave = async () => {
    if (!input) {
      toast.error('Cannot save: input data not available');
      return;
    }

    try {
      const backendRun = convertToBackendRun(input, result);
      await saveSleepRun.mutateAsync({
        ...backendRun,
        runTimestamp: BigInt(Date.now() * 1_000_000), // Convert to nanoseconds
      });
      setHasSaved(true);
      toast.success('Sleep analysis saved to history');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Consent')) {
        toast.error('Consent required to save analysis');
      } else {
        toast.error('Failed to save analysis');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Input
        </Button>
        <div className="flex gap-2">
          {canSave && input && (
            <Button variant="outline" onClick={handleSave} disabled={saveSleepRun.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {saveSleepRun.isPending ? 'Saving...' : 'Save to History'}
            </Button>
          )}
          {input && (
            <Button variant="outline" onClick={handleExportML}>
              <Download className="mr-2 h-4 w-4" />
              Export for ML
            </Button>
          )}
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Data stored:</strong> This tool uses behavioral phone-usage metadata and derived metrics only. No content is captured.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Sleep Analysis Summary (Last {result.daysAnalyzed} Days)</CardTitle>
          <CardDescription>Pattern-based sleep cycle estimation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Sleep Onset</p>
              <p className="text-2xl font-bold">{result.averageSleepOnset}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Wake Time</p>
              <p className="text-2xl font-bold">{result.averageWakeTime}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Duration</p>
              <p className="text-2xl font-bold">{result.averageDuration}h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sleep Consistency Score</p>
              <p className="text-2xl font-bold">{result.sleepConsistencyScore}/100</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Circadian Stability</p>
              <Badge variant={result.circadianStability === 'Stable' ? 'default' : 'outline'}>
                {result.circadianStability}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estimated Chronotype</p>
              <p className="font-medium">{result.estimatedChronotype}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sleep Debt</p>
              <p className="font-medium">
                {result.sleepDebt > 0 ? '+' : ''}
                {result.sleepDebt}h
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Night Disruption Frequency</p>
            <p className="font-medium">{result.nightDisruptionFrequency} checks/night</p>
          </div>
        </CardContent>
      </Card>

      {result.riskIndicators.length > 0 && (
        <Card className="border-amber-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Risk Indicators
            </CardTitle>
            <CardDescription>Patterns that may affect sleep quality</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.riskIndicators.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {result.optimizationSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Optimization Suggestions
            </CardTitle>
            <CardDescription>Evidence-based behavioral recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {result.optimizationSuggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="font-semibold text-primary">{idx + 1}.</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {result.advancedMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              Advanced Metrics
            </CardTitle>
            <CardDescription>Extended analysis (14+ days)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Estimated REM Cycle Timing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {result.advancedMetrics.remCycleTiming.map((cycle, idx) => (
                  <li key={idx}>{cycle}</li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Ideal Bedtime Window</h4>
              <p className="text-sm text-muted-foreground">{result.advancedMetrics.idealBedtimeWindow}</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Sleep Recovery Projection</h4>
              <p className="text-sm text-muted-foreground">{result.advancedMetrics.recoveryProjection}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Limitation Disclosure</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">
            Sleep estimates are behavioral approximations derived from phone usage patterns and are not a medical assessment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
