import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { THERAPY_LAYERS, EXISTING_TOOLS_BY_LAYER, ALL_THERAPY_MODULES, TherapyLayer } from './therapyPathwayModel';
import MentalHealthDisclaimerCard from './MentalHealthDisclaimerCard';
import { useGetAllModuleProgress } from '../../../hooks/useQueries';
import TherapyModuleScreen from './modules/TherapyModuleScreen';
import ConditionGuidanceDialog from '../condition-guidance/ConditionGuidanceDialog';

interface TherapyPathwayTabProps {
  onBack: () => void;
  initialModuleId?: string | null;
}

export default function TherapyPathwayTab({ onBack, initialModuleId }: TherapyPathwayTabProps) {
  const { data: allProgress = [] } = useGetAllModuleProgress();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(initialModuleId || null);
  const [showConditionGuidance, setShowConditionGuidance] = useState(false);

  useEffect(() => {
    if (initialModuleId) {
      setSelectedModuleId(initialModuleId);
    }
  }, [initialModuleId]);

  const getModuleProgress = (moduleId: string) => {
    return allProgress.find((p) => p.moduleId === moduleId);
  };

  const getLayerColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20',
      green: 'border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20',
      amber: 'border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20',
      purple: 'border-purple-200 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-950/20',
      pink: 'border-pink-200 bg-pink-50/50 dark:border-pink-900/50 dark:bg-pink-950/20',
    };
    return colors[color] || colors.blue;
  };

  const handleOpenModuleFromGuidance = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  if (selectedModuleId) {
    return (
      <TherapyModuleScreen
        moduleId={selectedModuleId}
        onBack={() => setSelectedModuleId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Therapy Pathway</h2>
            <p className="text-muted-foreground">
              Structured, evidence-based self-guided modules organized by therapeutic stage
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowConditionGuidance(true)} className="gap-2">
          <BookOpen className="h-4 w-4" />
          Condition Guidance
        </Button>
      </div>

      <ConditionGuidanceDialog
        open={showConditionGuidance}
        onOpenChange={setShowConditionGuidance}
        onOpenModule={handleOpenModuleFromGuidance}
      />

      <MentalHealthDisclaimerCard />

      <div className="space-y-8">
        {THERAPY_LAYERS.map((layer) => {
          const existingTools = EXISTING_TOOLS_BY_LAYER[layer.id as TherapyLayer];
          const layerModules = ALL_THERAPY_MODULES.filter((m) => m.layer === layer.id);
          const completedCount = layerModules.filter((m) => getModuleProgress(m.id)?.isCompleted).length;
          const totalCount = layerModules.length;
          const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

          return (
            <Card key={layer.id} className={getLayerColor(layer.color)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{layer.name}</CardTitle>
                    <CardDescription className="mt-1">{layer.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {completedCount}/{totalCount} completed
                  </Badge>
                </div>
                {totalCount > 0 && (
                  <Progress value={progressPercent} className="mt-3" />
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Existing Tools</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {existingTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="rounded-lg border border-border bg-card p-3"
                      >
                        <p className="font-medium text-sm">{tool.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {layerModules.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Self-Guided Modules</h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {layerModules.map((module) => {
                        const progress = getModuleProgress(module.id);
                        const isCompleted = progress?.isCompleted || false;
                        const isInProgress = progress && !isCompleted;

                        return (
                          <button
                            key={module.id}
                            onClick={() => setSelectedModuleId(module.id)}
                            className="group rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md"
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <p className="flex-1 font-medium text-sm leading-tight">{module.name}</p>
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                              ) : isInProgress ? (
                                <Circle className="h-5 w-5 text-primary flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{module.description}</p>
                            {isInProgress && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                In Progress
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
