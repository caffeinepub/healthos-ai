import { ModuleProgress } from '../../../../backend';
import { ModuleRunnerState } from './TherapyModuleRunner';

export function buildModuleProgress(
  moduleId: string,
  state: ModuleRunnerState,
  isCompleted: boolean,
  anonymousMode: boolean
): ModuleProgress {
  const artifacts = Object.entries(state.answers).map(([key, value]) => {
    if (anonymousMode && typeof value === 'string' && value.length > 50) {
      return JSON.stringify({ stepId: key, value: '[redacted]', type: 'text' });
    }
    return JSON.stringify({ stepId: key, value, type: typeof value });
  });

  return {
    moduleId,
    currentStep: BigInt(state.currentStepIndex),
    isCompleted,
    lastSaved: BigInt(Date.now() * 1_000_000),
    artifacts: artifacts.length > 0 ? artifacts : undefined,
  };
}

export function parseModuleProgress(progress: ModuleProgress | null): ModuleRunnerState | undefined {
  if (!progress) return undefined;

  const answers: Record<string, any> = {};
  if (progress.artifacts) {
    for (const artifact of progress.artifacts) {
      try {
        const parsed = JSON.parse(artifact);
        answers[parsed.stepId] = parsed.value;
      } catch (e) {
        console.warn('Failed to parse artifact:', artifact);
      }
    }
  }

  return {
    currentStepIndex: Number(progress.currentStep),
    answers,
  };
}
