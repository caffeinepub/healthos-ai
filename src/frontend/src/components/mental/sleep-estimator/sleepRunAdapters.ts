// Adapters to convert between frontend sleep analysis and backend SleepEstimatorRun

import { SleepAnalysisInput, SleepAnalysisOutput } from './types';
import { SleepEstimatorRun, NormalizedSleepInput } from '../../../backend';
import { getMinutesFromTime } from './timeUtils';

export function convertToBackendRun(
  input: SleepAnalysisInput,
  output: SleepAnalysisOutput
): Omit<SleepEstimatorRun, 'runTimestamp'> {
  // Convert frontend daily inputs to backend NormalizedSleepInput
  const normalizedDailyInputs: NormalizedSleepInput[] = input.days.map(day => {
    const lastActivityMins = getMinutesFromTime(day.lastActivity);
    const firstActivityMins = getMinutesFromTime(day.firstActivity);
    
    // Compute sleep onset and wake time
    const bedtimeMins = (lastActivityMins + 50) % (24 * 60); // Using inactivity threshold
    const wakeTimeMins = firstActivityMins;
    
    // Duration calculation
    let durationMins = wakeTimeMins - bedtimeMins;
    if (durationMins < 0) {
      durationMins += 24 * 60;
    }
    const sleepDuration = durationMins / 60;
    
    return {
      timeZone: input.timeZone,
      bedtime: BigInt(bedtimeMins),
      wakeTime: BigInt(wakeTimeMins),
      sleepDuration,
      sleepQualityRating: BigInt(7), // Default placeholder
      napTime: undefined,
      napDuration: undefined,
      physicalActivityIntensity: BigInt(5), // Default placeholder
      screenTimeBeforeBed: day.totalScreenTimeMinutes / 60,
      nutritionScore: 7.0, // Default placeholder
      caffeineConsumption: 0.0, // Default placeholder
      substanceUseIndicator: false,
      stressLevel: BigInt(5), // Default placeholder
      cognitiveFatigueScore: BigInt(5), // Default placeholder
      emotionalStateScore: BigInt(7), // Default placeholder
      sleepPreparationRating: BigInt(7), // Default placeholder
      sleepConsistencyScore: output.sleepConsistencyScore / 100,
      sleepAwakeningCount: BigInt(day.nightChecks?.length || 0),
      brightnessInSleepingArea: BigInt(3), // Default placeholder
      noiseLevelInSleepingArea: BigInt(3), // Default placeholder
      sleepLatency: 50 / 60, // Inactivity threshold in hours
      environmentalQualityScore: 7.0, // Default placeholder
    };
  });
  
  // Convert output to backend SleepMetrics
  const summaryMetrics = {
    averageSleepDuration: output.averageDuration,
    sleepEfficiency: output.sleepConsistencyScore / 100,
    sleepLatency: 50 / 60, // Inactivity threshold in hours
    deepSleepPercentage: 0.2, // Placeholder
    remSleepPercentage: 0.25, // Placeholder
    sleepConsistencyScore: output.sleepConsistencyScore / 100,
    restfulnessScore: output.sleepConsistencyScore / 100,
    circadianRhythmScore: output.circadianStability === 'Stable' ? 0.9 : output.circadianStability === 'Moderate' ? 0.6 : 0.3,
    sleepTrend: output.sleepDebt > 0 ? 'Declining' : output.sleepDebt < 0 ? 'Improving' : 'Stable',
    overallSleepHealthScore: output.sleepConsistencyScore / 100,
  };
  
  // Convert risk indicators
  const riskIndicators = {
    sleepDisorderRisk: output.riskIndicators.length > 0 ? 0.6 : 0.2,
    burnoutRisk: 0.3, // Placeholder
    moodInstabilityRisk: 0.3, // Placeholder
    cognitiveFatigueRisk: 0.3, // Placeholder
    potentialSleepDisruptionFactors: output.riskIndicators,
    optimizationSuggestions: output.optimizationSuggestions,
    sleepImprovementEstimate: Math.abs(output.sleepDebt) * 0.1,
    projectedSleepDebt: output.sleepDebt,
    riskLevel: BigInt(output.riskIndicators.length > 2 ? 7 : output.riskIndicators.length > 0 ? 4 : 2),
    insomniaLikelihood: output.riskIndicators.length > 0 ? 0.4 : 0.1,
    performanceImpactScore: Math.abs(output.sleepDebt) * 0.15,
    interventionRecommendations: output.optimizationSuggestions,
  };
  
  return {
    daysAnalyzed: BigInt(output.daysAnalyzed),
    summaryMetrics,
    riskIndicators,
    optimizationSuggestions: output.optimizationSuggestions,
    advancedMetrics: undefined, // Not mapping advanced metrics for now
    normalizedDailyInputs,
    audioAnalysisMetadata: undefined,
    sensorDataUsed: undefined,
    dataFormatVersion: '1.0.0',
    notes: undefined,
  };
}

export interface UIReportModel {
  runTimestamp: Date;
  daysAnalyzed: number;
  output: SleepAnalysisOutput;
}

export function convertFromBackendRun(run: SleepEstimatorRun): UIReportModel {
  // Convert backend run to UI-friendly report model
  const output: SleepAnalysisOutput = {
    daysAnalyzed: Number(run.daysAnalyzed),
    averageSleepOnset: formatMinutesToTime(run.summaryMetrics.sleepLatency * 60), // Approximation
    averageWakeTime: '07:30', // Placeholder - not stored in backend
    averageDuration: run.summaryMetrics.averageSleepDuration,
    sleepConsistencyScore: Math.round(run.summaryMetrics.sleepConsistencyScore * 100),
    circadianStability: run.summaryMetrics.circadianRhythmScore > 0.8 ? 'Stable' : run.summaryMetrics.circadianRhythmScore > 0.5 ? 'Moderate' : 'Unstable',
    estimatedChronotype: 'Intermediate', // Placeholder - not stored in backend
    sleepDebt: run.riskIndicators.projectedSleepDebt,
    nightDisruptionFrequency: 0, // Placeholder
    riskIndicators: run.riskIndicators.potentialSleepDisruptionFactors,
    optimizationSuggestions: run.optimizationSuggestions,
    advancedMetrics: undefined,
  };
  
  return {
    runTimestamp: new Date(Number(run.runTimestamp) / 1_000_000), // Convert nanoseconds to milliseconds
    daysAnalyzed: Number(run.daysAnalyzed),
    output,
  };
}

function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = Math.floor(minutes % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
