import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  BarChart2,
  BookOpen,
  Brain,
  CheckCircle,
  ClipboardList,
  Dumbbell,
  Heart,
  Moon,
  Pause,
  Play,
  Shield,
  Sparkles,
  SunMedium,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { DailyLog } from "../backend";
import { useGetCallerUserProfile, useSaveDailyLog } from "../hooks/useQueries";
import AcuteModeTab from "./mental/AcuteModeTab";
import AssessmentsTab from "./mental/AssessmentsTab";
import CbtWorkspaceTab from "./mental/CbtWorkspaceTab";
import ConsentScreen from "./mental/ConsentScreen";
import DailyTrackingTab from "./mental/DailyTrackingTab";
import JournalCbtTab from "./mental/JournalCbtTab";
import WeeklyAnalyticsTab from "./mental/WeeklyAnalyticsTab";
import ConditionGuidanceDialog from "./mental/condition-guidance/ConditionGuidanceDialog";
import TherapyPathwayTab from "./mental/pathway/TherapyPathwayTab";
import SleepEstimatorPanel from "./mental/sleep-estimator/SleepEstimatorPanel";

interface MentalHealthTabProps {
  onNavigateToSettings?: () => void;
  onOpenProfileSetup?: () => void;
}

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
];

const MEDITATION_TYPES = [
  {
    id: "breathing",
    name: "Breathing",
    desc: "Calm your mind with rhythmic breathwork",
    color: "bg-blue-100 text-blue-700",
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes and relax your shoulders",
      "Breathe in slowly as the circle expands",
      "Hold gently when you feel full",
      "Release slowly as the circle contracts",
    ],
  },
  {
    id: "body-scan",
    name: "Body Scan",
    desc: "Release tension from head to toe",
    color: "bg-purple-100 text-purple-700",
    instructions: [
      "Lie down or sit comfortably",
      "Start by noticing sensations in your scalp",
      "Slowly move your attention down your body",
      "Release any tension you find with each exhale",
      "End with full-body awareness",
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    desc: "Anchor yourself in the present moment",
    color: "bg-green-100 text-green-700",
    instructions: [
      "Sit with your back straight but relaxed",
      "Notice sounds, sensations, and thoughts",
      "Observe without judgment",
      "Return to the breath if the mind wanders",
      "Simply be present",
    ],
  },
  {
    id: "loving-kindness",
    name: "Loving Kindness",
    desc: "Cultivate compassion for yourself and others",
    color: "bg-rose-100 text-rose-700",
    instructions: [
      "Bring to mind someone you love deeply",
      "Silently say: May you be happy, may you be safe",
      "Extend this feeling to yourself",
      "Now to a neutral person, then to all beings",
      "Rest in the warmth of this intention",
    ],
  },
  {
    id: "stress-relief",
    name: "Stress Relief",
    desc: "Melt away tension and mental clutter",
    color: "bg-amber-100 text-amber-700",
    instructions: [
      "Take a deep grounding breath",
      "Identify where you hold stress in your body",
      "On each exhale, release that tension",
      "Visualise stress leaving as grey smoke",
      "Breathe in calm golden light",
    ],
  },
];

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function MoodStressDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const saveDailyLog = useSaveDailyLog();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = async () => {
    const log: DailyLog = {
      id: getTodayKey(),
      mood: BigInt(mood),
      stressRating: BigInt(stress),
      emotionTags: selectedTags,
      cognitiveClarity: BigInt(Math.round((11 - stress) / 2)),
      productivity: BigInt(Math.round(mood / 2)),
      energyLevel: BigInt(Math.round(mood / 2)),
      timestamp: BigInt(Date.now()),
      sleepHours: 7,
    };
    try {
      await saveDailyLog.mutateAsync(log);
      toast.success("Daily log saved!");
      onClose();
    } catch {
      toast.error("Failed to save log");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md"
        showCloseButton={false}
        data-ocid="mood_stress.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Log Today&apos;s Mood &amp; Stress
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Mood{" "}
              <span className="text-muted-foreground font-normal">
                ({mood}/10)
              </span>
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[mood]}
              onValueChange={([v]) => setMood(v)}
              data-ocid="mood_stress.mood.input"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Low</span>
              <span>Excellent</span>
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Stress Level{" "}
              <span className="text-muted-foreground font-normal">
                ({stress}/10)
              </span>
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[stress]}
              onValueChange={([v]) => setStress(v)}
              data-ocid="mood_stress.stress.input"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>None</span>
              <span>Very High</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Emotion Tags</Label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleTag(tag)}
                  data-ocid="mood_stress.tag.toggle"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="mood_stress.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveDailyLog.isPending}
            data-ocid="mood_stress.save_button"
          >
            {saveDailyLog.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MeditationDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [duration, setDuration] = useState<5 | 10 | 15>(5);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">(
    "inhale",
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const meditation = MEDITATION_TYPES.find((m) => m.id === selectedType);

  const endSession = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathRef.current) clearInterval(breathRef.current);
    toast.success("Meditation session complete! 🧘");
    onClose();
    setSelectedType(null);
  }, [onClose]);

  const startSession = () => {
    setSecondsLeft(duration * 60);
    setIsRunning(true);
    setBreathPhase("inhale");
    let phase = 0;
    breathRef.current = setInterval(() => {
      phase = (phase + 1) % 3;
      setBreathPhase(
        ["inhale", "hold", "exhale"][phase] as "inhale" | "hold" | "exhale",
      );
    }, 4000);
  };

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          endSession();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, endSession]);

  useEffect(() => {
    if (!open) {
      setIsRunning(false);
      setSelectedType(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breathRef.current) clearInterval(breathRef.current);
    }
  }, [open]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const breathLabel: Record<"inhale" | "hold" | "exhale", string> = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="meditation.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Guided Meditation
          </DialogTitle>
        </DialogHeader>

        {!selectedType && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose a meditation style:
            </p>
            {MEDITATION_TYPES.map((mt) => (
              <button
                key={mt.id}
                type="button"
                className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                onClick={() => setSelectedType(mt.id)}
                data-ocid="meditation.type.button"
              >
                <div className="font-medium text-sm">{mt.name}</div>
                <div className="text-xs text-muted-foreground">{mt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {selectedType && !isRunning && (
          <div className="space-y-4">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${meditation?.color}`}
            >
              {meditation?.name}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Duration</Label>
              <div className="flex gap-2">
                {([5, 10, 15] as const).map((d) => (
                  <Button
                    key={d}
                    variant={duration === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration(d)}
                    data-ocid="meditation.duration.button"
                  >
                    {d} min
                  </Button>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Instructions
              </p>
              {meditation?.instructions.map((inst) => (
                <div key={inst} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  <span>{inst}</span>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedType(null)}
                data-ocid="meditation.back_button"
              >
                Back
              </Button>
              <Button
                onClick={startSession}
                data-ocid="meditation.start_button"
              >
                <Play className="h-4 w-4 mr-1" /> Start Session
              </Button>
            </DialogFooter>
          </div>
        )}

        {isRunning && (
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative flex items-center justify-center">
              <div
                className="rounded-full bg-primary/20 transition-all"
                style={{
                  width:
                    breathPhase === "inhale" || breathPhase === "hold"
                      ? 160
                      : 100,
                  height:
                    breathPhase === "inhale" || breathPhase === "hold"
                      ? 160
                      : 100,
                  transitionDuration: "4s",
                }}
              />
              <div className="absolute text-center">
                <div className="text-lg font-bold text-primary">
                  {breathLabel[breathPhase]}
                </div>
                <div className="text-2xl font-mono font-bold">
                  {formatTime(secondsLeft)}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              {meditation?.name} &middot; {duration} minutes
            </div>
            <Button
              variant="destructive"
              onClick={endSession}
              data-ocid="meditation.end_button"
            >
              <Pause className="h-4 w-4 mr-1" /> End Session
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type ToolKey =
  | "mood-stress"
  | "meditation"
  | "therapy-pathway"
  | "sleep-analysis"
  | "condition-guidance"
  | "cbt-workspace"
  | "assessments"
  | "journal"
  | "weekly-analytics"
  | "acute-intervention"
  | "daily-tracking"
  | "sleep-monitoring";

const TOOLS: {
  key: ToolKey;
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
  isDialog?: boolean;
}[] = [
  {
    key: "mood-stress",
    icon: Heart,
    title: "Mood & Stress",
    description:
      "Log daily emotional patterns and stress levels to identify trends over time.",
    action: "Log Today",
    isDialog: true,
  },
  {
    key: "meditation",
    icon: Sparkles,
    title: "Meditation",
    description:
      "Guided mindfulness sessions: breathing, body scan, loving-kindness, and more.",
    action: "Start Session",
    isDialog: true,
  },
  {
    key: "therapy-pathway",
    icon: Brain,
    title: "Therapy Pathway",
    description:
      "Structured self-guided modules: CBT, ACT, DBT, MCT, and evidence-based therapies.",
    action: "Explore Modules",
  },
  {
    key: "sleep-analysis",
    icon: Moon,
    title: "Sleep Analysis",
    description:
      "Analyze sleep cycles and get personalized optimization suggestions.",
    action: "Analyze Sleep",
  },
  {
    key: "condition-guidance",
    icon: BookOpen,
    title: "Condition Guidance",
    description:
      "Get evidence-based guidance for specific mental health conditions.",
    action: "Browse Conditions",
    isDialog: true,
  },
  {
    key: "cbt-workspace",
    icon: Dumbbell,
    title: "CBT Workspace",
    description:
      "Cognitive restructuring, thought records, distortion identification, and behavioral experiments.",
    action: "Open Workspace",
  },
  {
    key: "assessments",
    icon: ClipboardList,
    title: "Assessments",
    description:
      "PHQ-9, GAD-7, and other validated screening tools with automatic scoring.",
    action: "Take Assessment",
  },
  {
    key: "journal",
    icon: BadgeCheck,
    title: "Journal & Reflection",
    description:
      "AI-guided journaling with cognitive distortion detection and Socratic questioning.",
    action: "Start Journaling",
  },
  {
    key: "weekly-analytics",
    icon: BarChart2,
    title: "Weekly Analytics",
    description:
      "Burnout index, stress load, emotional stability scores, and mood trend visualizations.",
    action: "View Analytics",
  },
  {
    key: "acute-intervention",
    icon: Zap,
    title: "Acute Intervention",
    description:
      "Quick tools for panic attacks, anger, meeting anxiety, and acute stress episodes.",
    action: "Get Help Now",
  },
  {
    key: "daily-tracking",
    icon: Activity,
    title: "Daily Tracking",
    description:
      "Track sleep hours, energy, cognitive clarity, and productivity daily.",
    action: "Log Day",
  },
  {
    key: "sleep-monitoring",
    icon: SunMedium,
    title: "Sleep Monitoring",
    description:
      "Daily sleep log with smart phone-based detection of sleep onset and wake times.",
    action: "Monitor Sleep",
  },
];

export default function MentalHealthTab({
  onNavigateToSettings,
  onOpenProfileSetup,
}: MentalHealthTabProps) {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const [activeView, setActiveView] = useState<ToolKey | null>(null);
  const [showConditionGuidance, setShowConditionGuidance] = useState(false);
  const [showMoodStress, setShowMoodStress] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);

  const handleToolClick = (key: ToolKey, isDialog?: boolean) => {
    if (isDialog) {
      if (key === "mood-stress") setShowMoodStress(true);
      else if (key === "meditation") setShowMeditation(true);
      else if (key === "condition-guidance") setShowConditionGuidance(true);
    } else {
      setActiveView(key);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="mental.loading_state"
      >
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">
            Loading mental health tools...
          </p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4 rounded-full bg-muted p-4 inline-flex">
            <Brain className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Profile Setup Required</h3>
          <p className="text-muted-foreground mb-6">
            Please complete your profile to access mental health features.
          </p>
          <Button
            onClick={() => onOpenProfileSetup?.()}
            data-ocid="no_profile.setup_button"
          >
            Set Up Profile
          </Button>
        </div>
      </div>
    );
  }

  if (!userProfile.consentGiven) {
    return <ConsentScreen onOpenProfileSetup={onOpenProfileSetup} />;
  }

  // Inline tool view
  if (activeView) {
    return (
      <div className="space-y-4" data-ocid="mental.tool_grid.section">
        <Button
          variant="ghost"
          onClick={() => setActiveView(null)}
          data-ocid="mental.back_button"
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mental Health
        </Button>

        {activeView === "therapy-pathway" && (
          <TherapyPathwayTab onBack={() => setActiveView(null)} />
        )}
        {(activeView === "sleep-analysis" ||
          activeView === "sleep-monitoring") && <SleepEstimatorPanel />}
        {activeView === "cbt-workspace" && <CbtWorkspaceTab />}
        {activeView === "assessments" && <AssessmentsTab />}
        {activeView === "journal" && <JournalCbtTab />}
        {activeView === "weekly-analytics" && <WeeklyAnalyticsTab />}
        {activeView === "acute-intervention" && <AcuteModeTab />}
        {activeView === "daily-tracking" && <DailyTrackingTab />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Mental Health</h2>
        <p className="text-muted-foreground">
          Evidence-based mental health tools and tracking
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        data-ocid="mental.tool_grid.section"
      >
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.key}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleToolClick(tool.key, tool.isDialog)}
              data-ocid={`mental.${tool.key.replace(/-/g, "_")}.card`}
            >
              <CardHeader className="p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    {tool.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-[10px] leading-tight mt-0.5">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 h-10 text-xs font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToolClick(tool.key, tool.isDialog);
                  }}
                  data-ocid={`mental.${tool.key.replace(/-/g, "_")}.button`}
                >
                  {tool.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Important:</strong> This application provides self-help tools
          and is not a substitute for professional mental health care. If you
          are in crisis, please contact emergency services or a crisis hotline
          immediately.
        </AlertDescription>
      </Alert>

      <MoodStressDialog
        open={showMoodStress}
        onClose={() => setShowMoodStress(false)}
      />
      <MeditationDialog
        open={showMeditation}
        onClose={() => setShowMeditation(false)}
      />
      <ConditionGuidanceDialog
        open={showConditionGuidance}
        onOpenChange={setShowConditionGuidance}
        onNavigateToSettings={onNavigateToSettings}
      />
    </div>
  );
}
