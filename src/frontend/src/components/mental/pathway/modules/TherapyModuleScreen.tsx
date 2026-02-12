import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ALL_THERAPY_MODULES } from '../therapyPathwayModel';
import { MODULE_DEFINITIONS } from './moduleDefinitions';
import { ELITE_MODULE_DEFINITIONS } from './eliteModuleDefinitions';
import TherapyModuleRunner, { ModuleRunnerState } from './TherapyModuleRunner';
import { useGetModuleProgress, useSaveModuleProgress, useGetCallerUserProfile } from '../../../../hooks/useQueries';
import { buildModuleProgress, parseModuleProgress } from './modulePersistence';
import { toast } from 'sonner';
import MentalHealthDisclaimerCard from '../MentalHealthDisclaimerCard';

interface TherapyModuleScreenProps {
  moduleId: string;
  onBack: () => void;
}

export default function TherapyModuleScreen({ moduleId, onBack }: TherapyModuleScreenProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: savedProgress, isLoading: progressLoading } = useGetModuleProgress(moduleId);
  const saveProgress = useSaveModuleProgress();
  const [runnerState, setRunnerState] = useState<ModuleRunnerState | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const moduleInfo = ALL_THERAPY_MODULES.find((m) => m.id === moduleId);
  const moduleDefinition = MODULE_DEFINITIONS[moduleId] || ELITE_MODULE_DEFINITIONS[moduleId];

  useEffect(() => {
    if (!progressLoading && savedProgress) {
      const parsed = parseModuleProgress(savedProgress);
      if (parsed) {
        setRunnerState(parsed);
        setIsCompleted(savedProgress.isCompleted);
      }
    } else if (!progressLoading && !savedProgress) {
      setRunnerState({ currentStepIndex: 0, answers: {} });
    }
  }, [savedProgress, progressLoading]);

  if (!moduleInfo || !moduleDefinition) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Module not found</p>
      </div>
    );
  }

  if (progressLoading || !runnerState) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading module...</p>
      </div>
    );
  }

  const handleStateChange = async (state: ModuleRunnerState) => {
    setRunnerState(state);
    try {
      const progress = buildModuleProgress(
        moduleId,
        state,
        false,
        userProfile?.anonymousMode || false
      );
      await saveProgress.mutateAsync(progress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleComplete = async () => {
    if (!runnerState) return;
    try {
      const progress = buildModuleProgress(
        moduleId,
        runnerState,
        true,
        userProfile?.anonymousMode || false
      );
      await saveProgress.mutateAsync(progress);
      setIsCompleted(true);
      toast.success('Module completed!');
    } catch (error) {
      toast.error('Failed to save completion');
      console.error(error);
    }
  };

  const handleRestart = () => {
    setRunnerState({ currentStepIndex: 0, answers: {} });
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">{moduleInfo.name}</h2>
            <p className="text-muted-foreground">{moduleInfo.description}</p>
          </div>
        </div>

        <Card className="border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle>Module Completed!</CardTitle>
            </div>
            <CardDescription>
              You have successfully completed this module. You can review your progress or restart if you'd like to practice again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button onClick={handleRestart} variant="outline">
                Restart Module
              </Button>
              <Button onClick={onBack}>Back to Pathway</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{moduleInfo.name}</h2>
          <p className="text-muted-foreground">{moduleInfo.description}</p>
        </div>
      </div>

      {moduleDefinition.disclaimer && (
        <Alert className="border-amber-200 dark:border-amber-900/50">
          <AlertDescription>{moduleDefinition.disclaimer}</AlertDescription>
        </Alert>
      )}

      {userProfile?.anonymousMode && (
        <Alert>
          <AlertDescription>
            <strong>Anonymous mode is enabled.</strong> Your free-text responses will not be stored on-chain. Only structured progress data will be saved.
          </AlertDescription>
        </Alert>
      )}

      <TherapyModuleRunner
        steps={moduleDefinition.steps}
        initialState={runnerState}
        onStateChange={handleStateChange}
        onComplete={handleComplete}
      />

      <MentalHealthDisclaimerCard />
    </div>
  );
}
