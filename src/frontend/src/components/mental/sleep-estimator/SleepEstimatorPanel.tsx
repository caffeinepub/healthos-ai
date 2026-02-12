import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Moon, Activity, History } from 'lucide-react';
import { parseStructuredInput, parseJSONInput } from './inputParser';
import { analyzeSleepPatterns } from './engine';
import { generateOptimizationSuggestions } from './suggestions';
import { SleepAnalysisOutput } from './types';
import SleepEstimatorReport from './SleepEstimatorReport';
import SleepIntelligenceBlueprint from './SleepIntelligenceBlueprint';
import SleepEstimatorHistory from './SleepEstimatorHistory';
import { useGetCallerUserProfile } from '../../../hooks/useQueries';

const EXAMPLE_INPUT = `Day 1:
Last activity: 00:42
First activity: 07:18
Night checks: 2 (02:14, 04:33)
Total screen time: 5h 32m

Day 2:
Last activity: 01:15
First activity: 08:02
Night checks: 0
Total screen time: 6h 10m

Day 3:
Last activity: 23:55
First activity: 07:45
Night checks: 1 (03:20)
Total screen time: 4h 50m

Day 4:
Last activity: 00:30
First activity: 07:00
Night checks: 0
Total screen time: 5h 15m

Day 5:
Last activity: 01:00
First activity: 08:15
Night checks: 3 (02:00, 03:30, 05:00)
Total screen time: 6h 30m

Day 6:
Last activity: 23:45
First activity: 06:50
Night checks: 0
Total screen time: 4h 45m

Day 7:
Last activity: 00:20
First activity: 07:30
Night checks: 1 (04:00)
Total screen time: 5h 20m`;

export default function SleepEstimatorPanel() {
  const { data: userProfile } = useGetCallerUserProfile();
  const [input, setInput] = useState('');
  const [timeZone, setTimeZone] = useState('America/New_York');
  const [wakeTarget, setWakeTarget] = useState('07:00');
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<SleepAnalysisOutput | null>(null);
  const [view, setView] = useState<'input' | 'blueprint' | 'history'>('input');
  const [currentInput, setCurrentInput] = useState<{ days: any[]; timeZone: string } | null>(null);

  const handleAnalyze = () => {
    setErrors([]);
    setResult(null);
    setCurrentInput(null);

    // Try structured text first, then JSON
    let parseResult = parseStructuredInput(input, timeZone);
    if (!parseResult.success) {
      parseResult = parseJSONInput(input, timeZone);
    }

    if (!parseResult.success) {
      setErrors(parseResult.errors);
      return;
    }

    try {
      const analysisInput = {
        ...parseResult.data!,
        wakeTarget: parseResult.data!.days.length >= 14 ? wakeTarget : undefined,
      };
      const output = analyzeSleepPatterns(analysisInput);
      const suggestions = generateOptimizationSuggestions(output);
      const finalOutput = { ...output, optimizationSuggestions: suggestions };
      setResult(finalOutput);
      setCurrentInput(analysisInput);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Analysis failed']);
    }
  };

  const handleLoadExample = () => {
    setInput(EXAMPLE_INPUT);
    setErrors([]);
  };

  const handleBackToInput = () => {
    setResult(null);
    setErrors([]);
    setCurrentInput(null);
  };

  if (!userProfile?.consentGiven) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              <CardTitle>Consent Required</CardTitle>
            </div>
            <CardDescription>
              Sleep analysis features require your consent to proceed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Please visit the Settings tab to review and accept the consent terms before accessing sleep analysis tools.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'blueprint') {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setView('input')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sleep Analysis
        </Button>
        <SleepIntelligenceBlueprint />
      </div>
    );
  }

  if (view === 'history') {
    return <SleepEstimatorHistory onBack={() => setView('input')} />;
  }

  if (result) {
    return <SleepEstimatorReport result={result} onBack={handleBackToInput} input={currentInput || undefined} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Sleep Cycle Estimation</h2>
          <p className="text-muted-foreground">Analyze sleep patterns from phone usage data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView('history')}>
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button variant="outline" onClick={() => setView('blueprint')}>
            <Activity className="mr-2 h-4 w-4" />
            ML Blueprint
          </Button>
        </div>
      </div>

      <Alert>
        <Moon className="h-4 w-4" />
        <AlertDescription>
          This tool estimates sleep patterns using behavioral phone usage metadata. It does not provide medical diagnosis.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Input Sleep Data</CardTitle>
          <CardDescription>
            Provide 7-30 days of phone usage data. Supports structured text or JSON format (including ML-friendly extended fields).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Select value={timeZone} onValueChange={setTimeZone}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">America/New_York (EST/EDT)</SelectItem>
                <SelectItem value="America/Chicago">America/Chicago (CST/CDT)</SelectItem>
                <SelectItem value="America/Denver">America/Denver (MST/MDT)</SelectItem>
                <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (GMT/BST)</SelectItem>
                <SelectItem value="Europe/Paris">Europe/Paris (CET/CEST)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                <SelectItem value="Australia/Sydney">Australia/Sydney (AEDT/AEST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="input">Sleep Data</Label>
              <Button variant="ghost" size="sm" onClick={handleLoadExample}>
                Load Example
              </Button>
            </div>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your sleep data here..."
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Format: Structured text (Day N: Last activity: HH:MM, First activity: HH:MM, Night checks: N (HH:MM, ...), Total screen time: Xh Ym)
              or JSON array with optional ML fields (hourlyScreenTime, hourlyUnlockCount, unlockBurstTimes, inactivityBlocks).
            </p>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleAnalyze} className="w-full" disabled={!input.trim()}>
            Analyze Sleep Patterns
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced (14+ days)</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Sleep Metrics</CardTitle>
              <CardDescription>Available for 7-30 days of data</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Average sleep onset and wake time</li>
                <li>Average sleep duration</li>
                <li>Sleep consistency score (0-100)</li>
                <li>Circadian stability assessment</li>
                <li>Chronotype classification</li>
                <li>Sleep debt calculation</li>
                <li>Night disruption frequency</li>
                <li>Risk indicators</li>
                <li>Optimization suggestions</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Metrics</CardTitle>
              <CardDescription>Requires 14+ days of data and wake target time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wakeTarget">Target Wake Time</Label>
                <Select value={wakeTarget} onValueChange={setWakeTarget}>
                  <SelectTrigger id="wakeTarget">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">06:00</SelectItem>
                    <SelectItem value="06:30">06:30</SelectItem>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="07:30">07:30</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="08:30">08:30</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Estimated REM cycle timing (90-minute model)</li>
                <li>Ideal bedtime recommendation based on wake target</li>
                <li>Sleep recovery projection</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
