import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetDailyLogs, useSaveDailyLog, useGetCallerUserProfile } from '../../hooks/useQueries';
import { getTodayKey, formatDate } from '../mental/dateTime';
import { EMOTION_TAGS } from './tracking/emotionTags';
import { DailyLog } from '../../backend';
import { toast } from 'sonner';
import { Plus, Calendar } from 'lucide-react';

export default function DailyTrackingTab() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: logs = [] } = useGetDailyLogs();
  const saveDailyLog = useSaveDailyLog();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mood, setMood] = useState([5]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [sleepHours, setSleepHours] = useState('7');
  const [energy, setEnergy] = useState([5]);
  const [cognitiveClarity, setCognitiveClarity] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [productivity, setProductivity] = useState([5]);

  const handleSave = async () => {
    if (!profile) return;

    const sleepValue = parseFloat(sleepHours);
    if (isNaN(sleepValue) || sleepValue < 0) {
      toast.error('Please enter a valid sleep hours value');
      return;
    }

    const allTags = customTag.trim() ? [...selectedTags, customTag.trim()] : selectedTags;

    const log: DailyLog = {
      id: getTodayKey(profile.timeZone),
      mood: BigInt(mood[0]),
      emotionTags: allTags,
      sleepHours: sleepValue,
      energyLevel: BigInt(energy[0]),
      cognitiveClarity: BigInt(cognitiveClarity[0]),
      stressRating: BigInt(stress[0]),
      productivity: BigInt(productivity[0]),
      timestamp: BigInt(Date.now() * 1_000_000),
    };

    try {
      await saveDailyLog.mutateAsync(log);
      toast.success('Daily log saved successfully!');
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save daily log');
      console.error(error);
    }
  };

  const resetForm = () => {
    setMood([5]);
    setSelectedTags([]);
    setCustomTag('');
    setSleepHours('7');
    setEnergy([5]);
    setCognitiveClarity([5]);
    setStress([5]);
    setProductivity([5]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Daily Tracking</h2>
          <p className="text-muted-foreground">Log your mood, energy, and behavior</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Today
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Daily Log Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Mood (1-10)</Label>
                <Slider value={mood} onValueChange={setMood} min={1} max={10} step={1} />
                <p className="text-center text-sm text-muted-foreground">{mood[0]}/10</p>
              </div>

              <div className="space-y-3">
                <Label>Emotion Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add custom tag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep">Sleep Hours</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Energy Level (1-10)</Label>
                <Slider value={energy} onValueChange={setEnergy} min={1} max={10} step={1} />
                <p className="text-center text-sm text-muted-foreground">{energy[0]}/10</p>
              </div>

              <div className="space-y-3">
                <Label>Cognitive Clarity (1-10)</Label>
                <Slider
                  value={cognitiveClarity}
                  onValueChange={setCognitiveClarity}
                  min={1}
                  max={10}
                  step={1}
                />
                <p className="text-center text-sm text-muted-foreground">
                  {cognitiveClarity[0]}/10
                </p>
              </div>

              <div className="space-y-3">
                <Label>Stress Rating (1-10)</Label>
                <Slider value={stress} onValueChange={setStress} min={1} max={10} step={1} />
                <p className="text-center text-sm text-muted-foreground">{stress[0]}/10</p>
              </div>

              <div className="space-y-3">
                <Label>Productivity (1-10)</Label>
                <Slider
                  value={productivity}
                  onValueChange={setProductivity}
                  min={1}
                  max={10}
                  step={1}
                />
                <p className="text-center text-sm text-muted-foreground">{productivity[0]}/10</p>
              </div>

              <Button onClick={handleSave} className="w-full" disabled={saveDailyLog.isPending}>
                {saveDailyLog.isPending ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>Your daily tracking history</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground">No logs yet. Start tracking today!</p>
          ) : (
            <div className="space-y-3">
              {logs
                .sort((a, b) => Number(b.timestamp - a.timestamp))
                .slice(0, 10)
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{log.id}</p>
                        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                          <span>Mood: {Number(log.mood)}/10</span>
                          <span>•</span>
                          <span>Energy: {Number(log.energyLevel)}/10</span>
                          <span>•</span>
                          <span>Sleep: {log.sleepHours}h</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {log.emotionTags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {log.emotionTags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{log.emotionTags.length - 3}
                        </Badge>
                      )}
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
