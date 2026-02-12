import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ModuleStep } from './moduleDefinitions';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

export interface ModuleRunnerState {
  currentStepIndex: number;
  answers: Record<string, any>;
}

interface TherapyModuleRunnerProps {
  steps: ModuleStep[];
  initialState?: ModuleRunnerState;
  onStateChange: (state: ModuleRunnerState) => void;
  onComplete: () => void;
}

export default function TherapyModuleRunner({
  steps,
  initialState,
  onStateChange,
  onComplete,
}: TherapyModuleRunnerProps) {
  const [state, setState] = useState<ModuleRunnerState>(
    initialState || { currentStepIndex: 0, answers: {} }
  );

  const currentStep = steps[state.currentStepIndex];
  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === steps.length - 1;
  const currentAnswer = state.answers[currentStep.id];

  const updateState = (newState: Partial<ModuleRunnerState>) => {
    const updated = { ...state, ...newState };
    setState(updated);
    onStateChange(updated);
  };

  const handleAnswerChange = (value: any) => {
    updateState({
      answers: { ...state.answers, [currentStep.id]: value },
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      updateState({ currentStepIndex: state.currentStepIndex + 1 });
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      updateState({ currentStepIndex: state.currentStepIndex - 1 });
    }
  };

  const canProceed = () => {
    if (currentStep.type === 'info') return true;
    if (currentStep.type === 'checklist') return true;
    return currentAnswer !== undefined && currentAnswer !== '' && currentAnswer !== null;
  };

  const renderStepInput = () => {
    switch (currentStep.type) {
      case 'info':
        return (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-base">
              {currentStep.prompt}
              {currentStep.info && (
                <p className="mt-2 text-sm text-muted-foreground">{currentStep.info}</p>
              )}
            </AlertDescription>
          </Alert>
        );

      case 'text':
        return (
          <div className="space-y-3">
            <Label>{currentStep.prompt}</Label>
            <Input
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentStep.placeholder}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-3">
            <Label>{currentStep.prompt}</Label>
            <Textarea
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentStep.placeholder}
              rows={6}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-3">
            <Label>{currentStep.prompt}</Label>
            <Select value={currentAnswer || ''} onValueChange={handleAnswerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {currentStep.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-3">
            <Label>{currentStep.prompt}</Label>
            <div className="space-y-2">
              {currentStep.options?.map((option) => {
                const selected = (currentAnswer || []) as string[];
                const isChecked = selected.includes(option);
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const newSelected = checked
                          ? [...selected, option]
                          : selected.filter((s) => s !== option);
                        handleAnswerChange(newSelected);
                      }}
                    />
                    <label htmlFor={option} className="text-sm cursor-pointer">
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-3">
            <Label>{currentStep.prompt}</Label>
            <div className="space-y-4">
              <Slider
                value={[currentAnswer || currentStep.min || 0]}
                onValueChange={(value) => handleAnswerChange(value[0])}
                min={currentStep.min || 0}
                max={currentStep.max || 10}
                step={1}
              />
              <p className="text-center text-lg font-semibold">
                {currentAnswer !== undefined ? currentAnswer : currentStep.min || 0}
              </p>
            </div>
          </div>
        );

      case 'checklist':
        return (
          <div className="space-y-3">
            <Label>{currentStep.prompt}</Label>
            <div className="space-y-2">
              {currentStep.options?.map((option) => {
                const checked = (currentAnswer || []) as string[];
                const isChecked = checked.includes(option);
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={isChecked}
                      onCheckedChange={(isChecked) => {
                        const newChecked = isChecked
                          ? [...checked, option]
                          : checked.filter((s) => s !== option);
                        handleAnswerChange(newChecked);
                      }}
                    />
                    <label htmlFor={option} className="text-sm cursor-pointer">
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{currentStep.title}</h3>
            <p className="text-sm text-muted-foreground">
              Step {state.currentStepIndex + 1} of {steps.length}
            </p>
          </div>
          {renderStepInput()}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isFirstStep}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {isLastStep ? 'Complete' : 'Next'}
          {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
