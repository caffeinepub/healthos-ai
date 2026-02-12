// Local-only ML export builder for sleep analysis data

import { SleepAnalysisInput, SleepAnalysisOutput, MLExportData, MLFeatureVector } from './types';
import { getMinutesFromTime } from './timeUtils';

export function buildMLExport(
  input: SleepAnalysisInput,
  output: SleepAnalysisOutput
): MLExportData {
  const derivedFeatures: MLFeatureVector[] = input.days.map((day, index) => {
    // Last significant interaction (in minutes from midnight)
    const lastSignificantInteractionMinutes = getMinutesFromTime(day.lastActivity);
    
    // First sustained interaction (in minutes from midnight)
    const firstSustainedInteractionMinutes = getMinutesFromTime(day.firstActivity);
    
    // Night unlock frequency (count of night checks)
    const nightUnlockFrequency = day.nightChecks?.length || 0;
    
    // Night active minutes (sum of check durations where available)
    const nightActiveMinutes = day.nightChecks?.reduce((sum, check) => {
      return sum + (check.durationMinutes || 0);
    }, 0) || 0;
    
    // Sleep midpoint (average of onset and wake)
    const onsetMins = lastSignificantInteractionMinutes + 50; // Using inactivity threshold
    const wakeMins = firstSustainedInteractionMinutes;
    let midpointMins = (onsetMins + wakeMins) / 2;
    if (wakeMins < onsetMins) {
      midpointMins = ((onsetMins + (wakeMins + 24 * 60)) / 2) % (24 * 60);
    }
    
    // Onset/wake variance contribution (deviation from mean)
    // These would be computed across all days, but we'll use placeholder for individual day
    const onsetVarianceContribution = 0; // Computed in aggregate
    const wakeVarianceContribution = 0; // Computed in aggregate
    
    // Inactivity block duration (longest inactivity period)
    const inactivityBlockDuration = day.inactivityBlocks?.reduce((max, block) => {
      return Math.max(max, block.durationMinutes);
    }, 0) || 0;
    
    return {
      date: day.date,
      lastSignificantInteractionMinutes,
      firstSustainedInteractionMinutes,
      nightUnlockFrequency,
      nightActiveMinutes,
      sleepMidpointMinutes: midpointMins,
      onsetVarianceContribution,
      wakeVarianceContribution,
      inactivityBlockDuration,
      totalScreenTimeMinutes: day.totalScreenTimeMinutes,
    };
  });
  
  return {
    metadata: {
      exportTimestamp: new Date().toISOString(),
      daysAnalyzed: input.days.length,
      timeZone: input.timeZone,
      dataFormatVersion: '1.0.0',
    },
    normalizedInputs: input.days,
    derivedFeatures,
    computedOutputs: output,
  };
}

export function downloadMLExport(data: MLExportData, filename: string = 'sleep-analysis-ml-export.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}
