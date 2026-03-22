import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  History,
  Info,
  Moon,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useDeviceActivityTracker } from "../../../hooks/useDeviceActivityTracker";
import { useGetCallerUserProfile } from "../../../hooks/useQueries";
import SleepEstimatorHistory from "./SleepEstimatorHistory";
import SleepEstimatorReport from "./SleepEstimatorReport";
import SleepIntelligenceBlueprint from "./SleepIntelligenceBlueprint";
import { analyzeSleepPatterns } from "./engine";
import { parseJSONInput, parseStructuredInput } from "./inputParser";
import { generateOptimizationSuggestions } from "./suggestions";
import type { SleepAnalysisOutput } from "./types";

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

interface SmartDetectionPanelProps {
  onAnalyze: (text: string) => void;
}

function SmartDetectionPanel({ onAnalyze }: SmartDetectionPanelProps) {
  const { isTracking, toggleTracking, daysCollected, exportAsStructuredText } =
    useDeviceActivityTracker();

  // Parse preview rows from exported text
  const getPreviewRows = () => {
    const text = exportAsStructuredText();
    if (!text) return [];
    const rows: {
      day: string;
      sleepTime: string;
      wakeTime: string;
      screenTime: string;
    }[] = [];
    const blocks = text.split(/\n\n+/);
    for (const block of blocks.slice(0, 5)) {
      const lines = block.trim().split("\n");
      const dayMatch = lines[0]?.match(/Day (\d+)/);
      const lastMatch = lines[1]?.match(/Last activity: (.+)/);
      const firstMatch = lines[2]?.match(/First activity: (.+)/);
      const screenMatch = lines[4]?.match(/Total screen time: (.+)/);
      if (dayMatch && lastMatch && firstMatch) {
        rows.push({
          day: `Day ${dayMatch[1]}`,
          sleepTime: lastMatch[1],
          wakeTime: firstMatch[1],
          screenTime: screenMatch?.[1] ?? "—",
        });
      }
    }
    return rows;
  };

  const previewRows = daysCollected >= 3 ? getPreviewRows() : [];

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Phone Activity Tracking</CardTitle>
          </div>
          <CardDescription>
            HealthOS uses app open/close events (page visibility) to passively
            estimate when you fall asleep and wake up — without accessing
            microphone, camera, or location.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-semibold">Enable Tracking</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isTracking ? "Tracking app activity" : "Tracking is off"}
              </p>
            </div>
            <Switch
              checked={isTracking}
              onCheckedChange={toggleTracking}
              data-ocid="smart_sleep.tracking_toggle"
            />
          </div>

          <div className="rounded-lg bg-muted px-4 py-3 text-sm">
            <span className="font-semibold text-foreground">
              {daysCollected}
            </span>{" "}
            <span className="text-muted-foreground">
              day{daysCollected !== 1 ? "s" : ""} of data collected
            </span>
          </div>

          {!isTracking && daysCollected === 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Enable tracking above. Open HealthOS every morning and close it
                before sleeping to build up enough data for accurate estimates.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {daysCollected >= 3 && previewRows.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Sleep Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Est. Sleep</TableHead>
                  <TableHead>Est. Wake</TableHead>
                  <TableHead>Screen Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row.day} data-ocid="smart_sleep.row">
                    <TableCell className="font-medium">{row.day}</TableCell>
                    <TableCell>{row.sleepTime}</TableCell>
                    <TableCell>{row.wakeTime}</TableCell>
                    <TableCell>{row.screenTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full"
        disabled={daysCollected < 3}
        onClick={() => {
          const text = exportAsStructuredText();
          if (text) onAnalyze(text);
        }}
        data-ocid="smart_sleep.analyze_button"
      >
        <Moon className="h-4 w-4 mr-2" />
        {daysCollected < 3
          ? `Analyze My Sleep (need ${3 - daysCollected} more day${3 - daysCollected !== 1 ? "s" : ""})`
          : "Analyze My Sleep"}
      </Button>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>For best results:</strong> Open HealthOS every morning and
          close it before sleeping. Estimates improve after 7+ days of
          consistent use.
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground text-center">
        Behavioral approximations only. Not a medical assessment.
      </p>
    </div>
  );
}

export default function SleepEstimatorPanel() {
  const { data: userProfile } = useGetCallerUserProfile();
  const [input, setInput] = useState("");
  const [timeZone, setTimeZone] = useState("America/New_York");
  const [wakeTarget, setWakeTarget] = useState("07:00");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<SleepAnalysisOutput | null>(null);
  const [view, setView] = useState<"input" | "blueprint" | "history">("input");
  const [currentInput, setCurrentInput] = useState<{
    days: any[];
    timeZone: string;
  } | null>(null);

  const handleAnalyze = (overrideInput?: string) => {
    const dataInput = overrideInput ?? input;
    setErrors([]);
    setResult(null);
    setCurrentInput(null);

    let parseResult = parseStructuredInput(dataInput, timeZone);
    if (!parseResult.success) {
      parseResult = parseJSONInput(dataInput, timeZone);
    }

    if (!parseResult.success) {
      setErrors(parseResult.errors);
      return;
    }

    try {
      const analysisInput = {
        ...parseResult.data!,
        wakeTarget:
          parseResult.data!.days.length >= 14 ? wakeTarget : undefined,
      };
      const output = analyzeSleepPatterns(analysisInput);
      const suggestions = generateOptimizationSuggestions(output);
      const finalOutput = { ...output, optimizationSuggestions: suggestions };
      setResult(finalOutput);
      setCurrentInput(analysisInput);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Analysis failed"]);
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
                Please visit the Settings tab to review and accept the consent
                terms before accessing sleep analysis tools.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === "blueprint") {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setView("input")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sleep Analysis
        </Button>
        <SleepIntelligenceBlueprint />
      </div>
    );
  }

  if (view === "history") {
    return <SleepEstimatorHistory onBack={() => setView("input")} />;
  }

  if (result) {
    return (
      <SleepEstimatorReport
        result={result}
        onBack={handleBackToInput}
        input={currentInput || undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Sleep Cycle Estimation
          </h2>
          <p className="text-muted-foreground">
            Analyze sleep patterns from phone usage data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView("history")}>
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button variant="outline" onClick={() => setView("blueprint")}>
            <Activity className="mr-2 h-4 w-4" />
            ML Blueprint
          </Button>
        </div>
      </div>

      <Alert>
        <Moon className="h-4 w-4" />
        <AlertDescription>
          This tool estimates sleep patterns using behavioral phone usage
          metadata. It does not provide medical diagnosis.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="smart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="smart">Smart Detection</TabsTrigger>
          <TabsTrigger value="manual">Enter Data</TabsTrigger>
        </TabsList>

        <TabsContent value="smart" className="mt-4">
          <SmartDetectionPanel
            onAnalyze={(text) => {
              setInput(text);
              handleAnalyze(text);
            }}
          />
        </TabsContent>

        <TabsContent value="manual" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Input Sleep Data</CardTitle>
              <CardDescription>
                Provide 7-30 days of phone usage data. Supports structured text
                or JSON format.
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
                    <SelectItem value="America/New_York">
                      America/New_York (EST/EDT)
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      America/Chicago (CST/CDT)
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      America/Denver (MST/MDT)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      America/Los_Angeles (PST/PDT)
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      Europe/London (GMT/BST)
                    </SelectItem>
                    <SelectItem value="Europe/Paris">
                      Europe/Paris (CET/CEST)
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                    <SelectItem value="Australia/Sydney">
                      Australia/Sydney (AEDT/AEST)
                    </SelectItem>
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
                  Format: Structured text (Day N: Last activity: HH:MM ...) or
                  JSON array.
                </p>
              </div>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={() => handleAnalyze()}
                className="w-full"
                disabled={!input.trim()}
              >
                Analyze Sleep Patterns
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Analysis</TabsTrigger>
                <TabsTrigger value="advanced">Advanced (14+ days)</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Sleep Metrics</CardTitle>
                    <CardDescription>
                      Available for 7-30 days of data
                    </CardDescription>
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
                    <CardDescription>
                      Requires 14+ days of data and wake target time
                    </CardDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
