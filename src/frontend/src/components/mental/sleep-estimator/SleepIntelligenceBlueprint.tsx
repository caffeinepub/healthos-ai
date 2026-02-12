import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Brain, TrendingUp, Moon, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SleepIntelligenceBlueprint() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Sleep Intelligence (ML Blueprint)</h2>
        <p className="text-muted-foreground mt-2">
          Production-grade behavioral sleep inference system architecture
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This blueprint describes the algorithmic approach used for sleep pattern analysis. The system uses deterministic heuristics and does not provide medical diagnosis.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Input Format</CardTitle>
          </div>
          <CardDescription>Behavioral metadata required for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Required Data (7–30 days):</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Screen unlock timestamps</li>
              <li>Screen lock timestamps</li>
              <li>Total screen time per hour</li>
              <li>First unlock time per day</li>
              <li>Last unlock time per day</li>
              <li>Night-time micro-awakenings (phone checks between 12 AM – 5 AM)</li>
              <li>Time zone (IANA format)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Optional Enhancement Data:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Hourly screen time distribution</li>
              <li>Unlock event counts per hour</li>
              <li>Notification interaction timing</li>
              <li>Phone inactivity blocks (duration and timing)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Algorithmic Inference Logic</CardTitle>
          </div>
          <CardDescription>Weighted heuristics for sleep pattern detection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              Sleep Onset Estimation
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Pattern suggests sleep onset ≈ Last significant screen interaction + inactivity threshold (45–60 min)
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Excludes brief notification checks (&lt;2 min)</li>
              <li>Excludes passive audio usage</li>
              <li>Uses configurable inactivity threshold</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              Wake-Up Time Detection
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Data indicates wake time ≈ First sustained activity &gt;3 min OR &gt;2 unlock events within 10 minutes
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Ignores single accidental unlock</li>
              <li>Ignores alarm dismissal without follow-up use</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              Total Sleep Duration
            </h4>
            <p className="text-sm text-muted-foreground">
              Sleep duration = Wake time – Sleep onset, subtracting night awakenings &gt;5 min
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              Sleep Consistency Score (0–100)
            </h4>
            <p className="text-sm text-muted-foreground mb-2">Based on:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Variance of sleep onset time (standard deviation)</li>
              <li>Variance of wake time</li>
              <li>Weekend shift difference</li>
              <li>Average sleep duration deviation from 7–9 hours</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">5</Badge>
              Circadian Stability Index
            </h4>
            <p className="text-sm text-muted-foreground mb-2">Measures:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Sleep midpoint consistency</li>
              <li>Social jetlag (weekday vs weekend difference)</li>
              <li>Late-night screen exposure frequency</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">6</Badge>
              Sleep Debt Calculation
            </h4>
            <p className="text-sm text-muted-foreground">
              Sleep debt = (7.5 hours × days) – actual sleep total
              <br />
              <span className="text-xs">Positive value = debt; Negative value = surplus</span>
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">7</Badge>
              Chronotype Classification
            </h4>
            <p className="text-sm text-muted-foreground mb-2">Pattern suggests chronotype based on average sleep onset:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Before 10:30 PM → Morning type</li>
              <li>10:30 PM – 12:30 AM → Intermediate</li>
              <li>After 12:30 AM → Evening type</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">8</Badge>
              Risk Flagging
            </h4>
            <p className="text-sm text-muted-foreground mb-2">Data indicates elevated risk if:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Sleep &lt;6 hours for 3+ consecutive days</li>
              <li>Wake variability &gt;90 minutes</li>
              <li>Night phone use between 2–4 AM frequently</li>
              <li>Sleep onset after 2 AM regularly</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Output Format</CardTitle>
          </div>
          <CardDescription>Structured analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Sleep Analysis Summary (Last X Days)</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Average Sleep Onset</li>
              <li>Average Wake Time</li>
              <li>Average Duration</li>
              <li>Sleep Consistency Score (0–100)</li>
              <li>Circadian Stability</li>
              <li>Estimated Chronotype</li>
              <li>Sleep Debt</li>
              <li>Night Disruption Frequency</li>
              <li>Risk Indicators</li>
              <li>Optimization Suggestions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <CardTitle>Optimization Recommendations Rules</CardTitle>
          </div>
          <CardDescription>Evidence-based behavioral suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Recommendations are behavioral, evidence-based, actionable, and short. Examples:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Fixed wake time anchoring</li>
            <li>60-min digital sunset</li>
            <li>Blue light cutoff time</li>
            <li>Gradual 15-min bedtime shift</li>
            <li>Morning sunlight exposure within 30 minutes of waking</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            All suggestions use probabilistic language: "May benefit from...", "Pattern suggests...", "Data indicates..."
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <CardTitle className="text-amber-900 dark:text-amber-100">Important Constraints</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-amber-900 dark:text-amber-100">
          <p>This system:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Avoids medical diagnosis</li>
            <li>Does not state "you have insomnia"</li>
            <li>Avoids certainty language</li>
            <li>Frames output probabilistically</li>
          </ul>
          <p className="font-semibold mt-4">Language used:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>"Pattern suggests…"</li>
            <li>"Data indicates…"</li>
            <li>"May benefit from…"</li>
          </ul>
        </CardContent>
      </Card>

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

      <div className="text-xs text-muted-foreground text-center py-4">
        <p>This blueprint describes a deterministic heuristic system for educational purposes.</p>
        <p>No actual machine learning models are trained or deployed in this application.</p>
      </div>
    </div>
  );
}
