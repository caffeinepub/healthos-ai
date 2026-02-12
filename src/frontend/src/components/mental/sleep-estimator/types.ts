// TypeScript types for behavioral sleep input and analysis output

export interface DailySleepInput {
  date: string; // YYYY-MM-DD format
  lastActivity: string; // HH:MM format (24-hour)
  firstActivity: string; // HH:MM format (24-hour)
  nightChecks?: Array<{ time: string; durationMinutes?: number; type?: string }>; // time in HH:MM format
  totalScreenTimeMinutes: number;
  // Optional ML-friendly fields
  hourlyScreenTime?: number[]; // 24-element array
  hourlyUnlockCount?: number[]; // 24-element array
  unlockBurstTimes?: string[]; // HH:MM format
  inactivityBlocks?: Array<{ start: string; end: string; durationMinutes: number }>;
}

export interface SleepAnalysisInput {
  days: DailySleepInput[];
  timeZone: string; // IANA time zone string
  wakeTarget?: string; // HH:MM format for advanced metrics
}

export interface SleepAnalysisOutput {
  daysAnalyzed: number;
  averageSleepOnset: string; // HH:MM format
  averageWakeTime: string; // HH:MM format
  averageDuration: number; // hours
  sleepConsistencyScore: number; // 0-100
  circadianStability: string; // "Stable", "Moderate", "Unstable"
  estimatedChronotype: string; // "Morning type", "Intermediate", "Evening type"
  sleepDebt: number; // hours (positive = debt, negative = surplus)
  nightDisruptionFrequency: number; // average checks per night
  riskIndicators: string[];
  optimizationSuggestions: string[];
  advancedMetrics?: {
    remCycleTiming: string[];
    idealBedtimeWindow: string;
    recoveryProjection: string;
  };
}

export interface DailyAnalysis {
  date: string;
  sleepOnset: Date;
  wakeTime: Date;
  duration: number; // hours
  nightAwakenings: number;
}

// ML Export types
export interface MLFeatureVector {
  date: string;
  lastSignificantInteractionMinutes: number;
  firstSustainedInteractionMinutes: number;
  nightUnlockFrequency: number;
  nightActiveMinutes: number;
  sleepMidpointMinutes: number;
  onsetVarianceContribution: number;
  wakeVarianceContribution: number;
  inactivityBlockDuration: number;
  totalScreenTimeMinutes: number;
}

export interface MLExportData {
  metadata: {
    exportTimestamp: string;
    daysAnalyzed: number;
    timeZone: string;
    dataFormatVersion: string;
  };
  normalizedInputs: DailySleepInput[];
  derivedFeatures: MLFeatureVector[];
  computedOutputs: SleepAnalysisOutput;
}
