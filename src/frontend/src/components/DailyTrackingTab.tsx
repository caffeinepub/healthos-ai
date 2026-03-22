import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Activity,
  Brain,
  Calendar,
  Flame,
  Heart,
  Moon,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { DailyLog } from "../backend";
import { useGetDailyLogs, useSaveDailyLog } from "../hooks/useQueries";

const EMOTION_TAGS = [
  "Happy",
  "Calm",
  "Anxious",
  "Sad",
  "Angry",
  "Grateful",
  "Overwhelmed",
  "Focused",
  "Tired",
  "Energized",
  "Content",
  "Frustrated",
];

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(timestamp: bigint) {
  return new Date(Number(timestamp)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DailyTrackingTab() {
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [productivity, setProductivity] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: logs = [], isLoading } = useGetDailyLogs();
  const saveDailyLog = useSaveDailyLog();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const log: DailyLog = {
      id: getTodayKey(),
      mood: BigInt(mood),
      stressRating: BigInt(stress),
      energyLevel: BigInt(energy),
      cognitiveClarity: BigInt(clarity),
      productivity: BigInt(productivity),
      sleepHours,
      emotionTags: selectedTags,
      timestamp: BigInt(Date.now()),
    };
    try {
      await saveDailyLog.mutateAsync(log);
      toast.success("Daily log saved! ✅");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const sliders = [
    {
      label: "Mood",
      value: mood,
      setter: setMood,
      icon: Heart,
      low: "Very Low",
      high: "Excellent",
      ocid: "daily.mood.input",
    },
    {
      label: "Stress Level",
      value: stress,
      setter: setStress,
      icon: Flame,
      low: "None",
      high: "Very High",
      ocid: "daily.stress.input",
    },
    {
      label: "Energy",
      value: energy,
      setter: setEnergy,
      icon: Zap,
      low: "Drained",
      high: "Fully Charged",
      ocid: "daily.energy.input",
    },
    {
      label: "Cognitive Clarity",
      value: clarity,
      setter: setClarity,
      icon: Brain,
      low: "Foggy",
      high: "Sharp",
      ocid: "daily.clarity.input",
    },
    {
      label: "Productivity",
      value: productivity,
      setter: setProductivity,
      icon: Activity,
      low: "Minimal",
      high: "Highly Productive",
      ocid: "daily.productivity.input",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Daily Log</h2>
        <p className="text-muted-foreground">
          Track how you feel today across key wellbeing dimensions
        </p>
      </div>

      <Card data-ocid="daily.form.card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Check-in
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sliders.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="space-y-2">
                <Label className="font-semibold flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {s.label}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({s.value}/10)
                  </span>
                </Label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[s.value]}
                  onValueChange={([v]) => s.setter(v)}
                  data-ocid={s.ocid}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{s.low}</span>
                  <span>{s.high}</span>
                </div>
              </div>
            );
          })}

          <div className="space-y-2">
            <Label className="font-semibold flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" />
              Sleep Hours{" "}
              <span className="text-muted-foreground font-normal">
                ({sleepHours}h)
              </span>
            </Label>
            <Slider
              min={0}
              max={12}
              step={0.5}
              value={[sleepHours]}
              onValueChange={([v]) => setSleepHours(v)}
              data-ocid="daily.sleep.input"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>12h+</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Emotion Tags</Label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleTag(tag)}
                  data-ocid="daily.emotion.toggle"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={saving || saveDailyLog.isPending}
            data-ocid="daily.save_button"
          >
            {saving ? "Saving..." : "Save Today's Log"}
          </Button>
        </CardContent>
      </Card>

      {/* Log History */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Recent Logs</h3>
        {isLoading ? (
          <div
            className="text-center py-8 text-muted-foreground"
            data-ocid="daily.loading_state"
          >
            Loading logs...
          </div>
        ) : logs.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground"
            data-ocid="daily.empty_state"
          >
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              No logs yet. Save your first check-in above!
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="daily.list">
            {logs.slice(0, 10).map((log, i) => (
              <Card key={log.id} data-ocid={`daily.item.${i + 1}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">
                      {formatDate(log.timestamp)}
                    </span>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {log.mood.toString()}/10
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />{" "}
                        {log.stressRating.toString()}/10
                      </span>
                      <span className="flex items-center gap-1">
                        <Moon className="h-3 w-3" /> {log.sleepHours}h
                      </span>
                    </div>
                  </div>
                  {log.emotionTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {log.emotionTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
