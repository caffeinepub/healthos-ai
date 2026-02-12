import { Intervention, JournalEntry, DailyLog } from '../../../backend';

export interface ProgressMetrics {
  distortionFrequency: number;
  beliefShiftAverage: number;
  avoidanceBehaviorScore: number;
}

export function computeProgressMetrics(
  interventions: Intervention[],
  journals: JournalEntry[],
  logs: DailyLog[]
): ProgressMetrics {
  // Distortion frequency reduction (count distortions over time)
  const recentJournals = journals.slice(-10);
  const distortionCount = recentJournals.reduce(
    (sum, j) => sum + j.cognitiveDistortions.length,
    0
  );
  const distortionFrequency = recentJournals.length > 0 ? distortionCount / recentJournals.length : 0;

  // Belief shift tracking (average belief strength change)
  const beliefStrengths = recentJournals.map((j) => Number(j.beliefStrength));
  const beliefShiftAverage =
    beliefStrengths.length > 0
      ? beliefStrengths.reduce((sum, b) => sum + b, 0) / beliefStrengths.length
      : 5;

  // Avoidance behavior score (based on productivity and energy)
  const recentLogs = logs.slice(-7);
  const avgProductivity =
    recentLogs.length > 0
      ? recentLogs.reduce((sum, l) => sum + Number(l.productivity), 0) / recentLogs.length
      : 5;
  const avoidanceBehaviorScore = 10 - avgProductivity;

  return {
    distortionFrequency,
    beliefShiftAverage,
    avoidanceBehaviorScore,
  };
}
