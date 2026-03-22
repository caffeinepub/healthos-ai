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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, BookOpen, Lightbulb, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { JournalEntry } from "../../backend";
import {
  useGetCallerUserProfile,
  useGetJournalEntries,
  useGetSafetyPlan,
  useSaveJournalEntry,
} from "../../hooks/useQueries";
import { analyzeJournalEntry } from "./journaling/analyzeJournalEntry";
import { generateReframe } from "./journaling/reframeTemplates";

export default function JournalCbtTab() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: entries = [] } = useGetJournalEntries();
  const { data: safetyPlan } = useGetSafetyPlan();
  const saveEntry = useSaveJournalEntry();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [restructureMode, setRestructureMode] = useState(false);
  const [targetThought, setTargetThought] = useState("");
  const [beliefStrength, setBeliefStrength] = useState([5]);
  const [evidenceFor, setEvidenceFor] = useState<
    Array<{ id: string; val: string }>
  >([{ id: "1", val: "" }]);
  const [evidenceAgainst, setEvidenceAgainst] = useState<
    Array<{ id: string; val: string }>
  >([{ id: "1", val: "" }]);
  const [reframe, setReframe] = useState("");

  const highRisk = safetyPlan && safetyPlan.riskLevel >= 7n;

  const handleAnalyze = () => {
    if (!content.trim()) {
      toast.error("Please write something first");
      return;
    }
    const result = analyzeJournalEntry(content);
    setAnalysis(result);
    setAnalyzed(true);
    toast.success("Analysis complete");
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please write something first");
      return;
    }

    const finalAnalysis = analysis || analyzeJournalEntry(content);

    const entry: JournalEntry = {
      id: `journal_${Date.now()}`,
      content: profile?.anonymousMode ? "" : content,
      cognitiveDistortions: finalAnalysis.cognitiveDistortions,
      emotionalIntensity: BigInt(finalAnalysis.emotionalIntensity),
      negativeBeliefs: finalAnalysis.negativeBeliefs,
      catastrophizing: finalAnalysis.catastrophizing,
      socraticPrompts: finalAnalysis.socraticPrompts,
      beliefStrength: BigInt(beliefStrength[0]),
      isReframed: !!reframe,
      timestamp: BigInt(Date.now() * 1_000_000),
    };

    try {
      await saveEntry.mutateAsync(entry);
      toast.success("Journal entry saved");
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save entry");
      console.error(error);
    }
  };

  const handleGenerateReframe = () => {
    const forList = evidenceFor.filter((e) => e.val.trim()).map((e) => e.val);
    const againstList = evidenceAgainst
      .filter((e) => e.val.trim())
      .map((e) => e.val);
    const generated = generateReframe(targetThought, forList, againstList);
    setReframe(generated);
  };

  const resetForm = () => {
    setContent("");
    setAnalyzed(false);
    setAnalysis(null);
    setRestructureMode(false);
    setTargetThought("");
    setBeliefStrength([5]);
    setEvidenceFor([{ id: "1", val: "" }]);
    setEvidenceAgainst([{ id: "1", val: "" }]);
    setReframe("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Journal & CBT</h2>
          <p className="text-muted-foreground">
            Reflect, analyze, and restructure your thoughts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Journal Entry</DialogTitle>
            </DialogHeader>

            {highRisk && (
              <Card className="border-red-200 dark:border-red-900/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-600">
                        Crisis Support Available
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        If you're in distress, please visit the Crisis Safety
                        tab for immediate resources.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        asChild
                      >
                        <a href="#crisis">Go to Crisis Support</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content">Write your thoughts</Label>
                <Textarea
                  id="content"
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
                {profile?.anonymousMode && (
                  <p className="text-xs text-muted-foreground">
                    Anonymous mode: Raw text will not be stored
                  </p>
                )}
              </div>

              {!analyzed && (
                <Button
                  onClick={handleAnalyze}
                  variant="outline"
                  className="w-full"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Analyze
                </Button>
              )}

              {analyzed && analysis && !highRisk && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Cognitive Distortions</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {analysis.cognitiveDistortions.length > 0 ? (
                          analysis.cognitiveDistortions.map((d: string) => (
                            <Badge key={d} variant="outline">
                              {d}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            None detected
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Emotional Intensity</Label>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {analysis.emotionalIntensity}/10
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm">Socratic Prompts</Label>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {analysis.socraticPrompts.map((p: string) => (
                          <li key={p}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={() => setRestructureMode(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Start Thought Restructuring
                    </Button>
                  </CardContent>
                </Card>
              )}

              {restructureMode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Thought Restructuring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="thought">Target Thought</Label>
                      <Input
                        id="thought"
                        placeholder="What specific thought do you want to examine?"
                        value={targetThought}
                        onChange={(e) => setTargetThought(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Belief Strength (1-10)</Label>
                      <Slider
                        value={beliefStrength}
                        onValueChange={setBeliefStrength}
                        min={1}
                        max={10}
                        step={1}
                      />
                      <p className="text-center text-sm text-muted-foreground">
                        {beliefStrength[0]}/10
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Evidence For</Label>
                      {evidenceFor.map((e) => (
                        <Input
                          key={e.id}
                          placeholder="Evidence supporting this thought"
                          value={e.val}
                          onChange={(ev) => {
                            setEvidenceFor(
                              evidenceFor.map((item) =>
                                item.id === e.id
                                  ? { ...item, val: ev.target.value }
                                  : item,
                              ),
                            );
                          }}
                        />
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEvidenceFor([
                            ...evidenceFor,
                            { id: String(Date.now()), val: "" },
                          ])
                        }
                      >
                        + Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Evidence Against</Label>
                      {evidenceAgainst.map((e) => (
                        <Input
                          key={e.id}
                          placeholder="Evidence contradicting this thought"
                          value={e.val}
                          onChange={(ev) => {
                            setEvidenceAgainst(
                              evidenceAgainst.map((item) =>
                                item.id === e.id
                                  ? { ...item, val: ev.target.value }
                                  : item,
                              ),
                            );
                          }}
                        />
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEvidenceAgainst([
                            ...evidenceAgainst,
                            { id: String(Date.now()), val: "" },
                          ])
                        }
                      >
                        + Add
                      </Button>
                    </div>
                    <Button
                      onClick={handleGenerateReframe}
                      variant="outline"
                      className="w-full"
                    >
                      Generate Reframe
                    </Button>
                    {reframe && (
                      <div className="rounded-lg bg-muted p-4">
                        <Label className="text-sm">Suggested Reframe</Label>
                        <p className="mt-2 text-sm">{reframe}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={saveEntry.isPending}
                >
                  {saveEntry.isPending ? "Saving..." : "Save Entry"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This is not therapy. If you need
              urgent help, visit the Crisis Safety tab.
            </p>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your journal history</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No entries yet. Start journaling!
            </p>
          ) : (
            <div className="space-y-3">
              {entries
                .sort((a, b) => Number(b.timestamp - a.timestamp))
                .slice(0, 10)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            Number(entry.timestamp) / 1_000_000,
                          ).toLocaleDateString()}
                        </p>
                        {entry.content && (
                          <p className="mt-2 text-sm line-clamp-2">
                            {entry.content}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {entry.cognitiveDistortions.map((d) => (
                            <Badge
                              key={d}
                              variant="outline"
                              className="text-xs"
                            >
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Intensity
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {Number(entry.emotionalIntensity)}/10
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
