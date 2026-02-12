// Deterministic Sleep Cycle Estimation Engine

import { SleepAnalysisInput, SleepAnalysisOutput, DailyAnalysis, DailySleepInput } from './types';
import { getMinutesFromTime, timeDifferenceMinutes, minutesToHoursMinutes } from './timeUtils';

// Configurable inactivity threshold (45-60 min range)
export const INACTIVITY_THRESHOLD_MINUTES = 50; // Adjustable within 45-60 range
const BRIEF_CHECK_THRESHOLD_MINUTES = 2;
const SUSTAINED_ACTIVITY_MINUTES = 3;
const IDEAL_SLEEP_HOURS = 7.5;

export function analyzeSleepPatterns(input: SleepAnalysisInput): SleepAnalysisOutput {
  if (input.days.length < 7 || input.days.length > 30) {
    throw new Error('Analysis requires 7-30 days of data');
  }

  // Analyze each day
  const dailyAnalyses: DailyAnalysis[] = input.days.map(day => analyzeSingleDay(day));

  // Compute aggregate metrics
  const avgSleepOnset = computeAverageSleepOnset(dailyAnalyses);
  const avgWakeTime = computeAverageWakeTime(dailyAnalyses);
  const avgDuration = computeAverageDuration(dailyAnalyses);
  const consistencyScore = computeConsistencyScore(dailyAnalyses);
  const circadianStability = computeCircadianStability(dailyAnalyses);
  const chronotype = classifyChronotype(avgSleepOnset);
  const sleepDebt = computeSleepDebt(dailyAnalyses);
  const nightDisruption = computeNightDisruptionFrequency(input.days);
  const riskIndicators = identifyRiskIndicators(dailyAnalyses, input.days);

  // Advanced metrics (14+ days)
  let advancedMetrics: SleepAnalysisOutput['advancedMetrics'] = undefined;
  if (input.days.length >= 14 && input.wakeTarget) {
    advancedMetrics = computeAdvancedMetrics(dailyAnalyses, input.wakeTarget, sleepDebt);
  }

  return {
    daysAnalyzed: input.days.length,
    averageSleepOnset: avgSleepOnset,
    averageWakeTime: avgWakeTime,
    averageDuration: avgDuration,
    sleepConsistencyScore: consistencyScore,
    circadianStability: circadianStability,
    estimatedChronotype: chronotype,
    sleepDebt: sleepDebt,
    nightDisruptionFrequency: nightDisruption,
    riskIndicators: riskIndicators,
    optimizationSuggestions: [], // Will be filled by suggestions.ts
    advancedMetrics: advancedMetrics,
  };
}

function analyzeSingleDay(day: DailySleepInput): DailyAnalysis {
  // Sleep onset: last activity + inactivity threshold
  // Refined: ignore brief checks (<2 min) when metadata available
  let lastActivityMins = getMinutesFromTime(day.lastActivity);
  
  // If night checks with duration metadata exist, filter out brief ones
  if (day.nightChecks && day.nightChecks.length > 0) {
    const significantChecks = day.nightChecks.filter(check => {
      if (check.durationMinutes !== undefined) {
        return check.durationMinutes >= BRIEF_CHECK_THRESHOLD_MINUTES;
      }
      return true; // Include if duration unknown
    });
    
    // If we have significant checks after lastActivity, use the last one
    if (significantChecks.length > 0) {
      const lastCheckMins = getMinutesFromTime(significantChecks[significantChecks.length - 1].time);
      if (lastCheckMins > lastActivityMins || (lastCheckMins < 6 * 60 && lastActivityMins > 18 * 60)) {
        lastActivityMins = lastCheckMins;
      }
    }
  }
  
  const sleepOnsetMins = (lastActivityMins + INACTIVITY_THRESHOLD_MINUTES) % (24 * 60);
  
  // Wake time: first sustained activity (>3 min) OR >2 unlock events within 10 minutes
  let wakeTimeMins = getMinutesFromTime(day.firstActivity);
  
  // Enhanced wake detection using unlock burst metadata
  if (day.unlockBurstTimes && day.unlockBurstTimes.length >= 2) {
    const firstBurstMins = getMinutesFromTime(day.unlockBurstTimes[0]);
    const secondBurstMins = getMinutesFromTime(day.unlockBurstTimes[1]);
    const timeDiff = Math.abs(secondBurstMins - firstBurstMins);
    
    if (timeDiff <= 10) {
      // Two unlocks within 10 minutes - use first as wake time
      wakeTimeMins = Math.min(firstBurstMins, wakeTimeMins);
    }
  }
  
  // Duration calculation
  let durationMins = wakeTimeMins - sleepOnsetMins;
  if (durationMins < 0) {
    durationMins += 24 * 60; // Handle day boundary
  }
  
  // Subtract night awakenings > 5 min
  let nightAwakenings = 0;
  if (day.nightChecks) {
    for (const check of day.nightChecks) {
      if (check.durationMinutes && check.durationMinutes > 5) {
        durationMins -= check.durationMinutes;
        nightAwakenings++;
      } else if (!check.durationMinutes) {
        // If duration not provided, count as awakening but don't subtract time
        nightAwakenings++;
      }
    }
  }
  
  const duration = durationMins / 60; // Convert to hours
  
  // Create dummy dates for time representation
  const baseDate = new Date(day.date);
  const sleepOnset = new Date(baseDate);
  sleepOnset.setHours(Math.floor(sleepOnsetMins / 60), sleepOnsetMins % 60, 0, 0);
  
  const wakeTime = new Date(baseDate);
  wakeTime.setHours(Math.floor(wakeTimeMins / 60), wakeTimeMins % 60, 0, 0);
  if (wakeTimeMins < sleepOnsetMins) {
    wakeTime.setDate(wakeTime.getDate() + 1);
  }
  
  return {
    date: day.date,
    sleepOnset,
    wakeTime,
    duration,
    nightAwakenings,
  };
}

function computeAverageSleepOnset(analyses: DailyAnalysis[]): string {
  // Convert to minutes from midnight, handling wrap-around
  const onsetMinutes = analyses.map(a => {
    const hours = a.sleepOnset.getHours();
    const minutes = a.sleepOnset.getMinutes();
    // Normalize late night times (after 18:00) to be before midnight
    let totalMins = hours * 60 + minutes;
    if (hours >= 18) {
      totalMins = totalMins - 24 * 60; // Make negative for averaging
    }
    return totalMins;
  });
  
  const avgMins = onsetMinutes.reduce((sum, m) => sum + m, 0) / onsetMinutes.length;
  
  // Convert back to 24-hour format
  let finalMins = avgMins;
  if (finalMins < 0) {
    finalMins += 24 * 60;
  }
  
  return minutesToHoursMinutes(Math.round(finalMins));
}

function computeAverageWakeTime(analyses: DailyAnalysis[]): string {
  const wakeMinutes = analyses.map(a => {
    return a.wakeTime.getHours() * 60 + a.wakeTime.getMinutes();
  });
  
  const avgMins = wakeMinutes.reduce((sum, m) => sum + m, 0) / wakeMinutes.length;
  return minutesToHoursMinutes(Math.round(avgMins));
}

function computeAverageDuration(analyses: DailyAnalysis[]): number {
  const totalDuration = analyses.reduce((sum, a) => sum + a.duration, 0);
  return Math.round((totalDuration / analyses.length) * 10) / 10; // Round to 1 decimal
}

function computeConsistencyScore(analyses: DailyAnalysis[]): number {
  // Based on variance of sleep onset, wake time, and duration deviation from 7-9 hours
  
  // Sleep onset variance (in minutes)
  const onsetMinutes = analyses.map(a => a.sleepOnset.getHours() * 60 + a.sleepOnset.getMinutes());
  const onsetMean = onsetMinutes.reduce((sum, m) => sum + m, 0) / onsetMinutes.length;
  const onsetVariance = onsetMinutes.reduce((sum, m) => sum + Math.pow(m - onsetMean, 2), 0) / onsetMinutes.length;
  const onsetStdDev = Math.sqrt(onsetVariance);
  
  // Wake time variance
  const wakeMinutes = analyses.map(a => a.wakeTime.getHours() * 60 + a.wakeTime.getMinutes());
  const wakeMean = wakeMinutes.reduce((sum, m) => sum + m, 0) / wakeMinutes.length;
  const wakeVariance = wakeMinutes.reduce((sum, m) => sum + Math.pow(m - wakeMean, 2), 0) / wakeMinutes.length;
  const wakeStdDev = Math.sqrt(wakeVariance);
  
  // Duration deviation from ideal range (7-9 hours)
  const durationDeviations = analyses.map(a => {
    if (a.duration < 7) return 7 - a.duration;
    if (a.duration > 9) return a.duration - 9;
    return 0;
  });
  const avgDeviation = durationDeviations.reduce((sum, d) => sum + d, 0) / durationDeviations.length;
  
  // Score calculation (0-100, higher is better)
  // Penalize high standard deviations and duration deviations
  const onsetPenalty = Math.min(onsetStdDev / 2, 30); // Max 30 points penalty
  const wakePenalty = Math.min(wakeStdDev / 2, 30); // Max 30 points penalty
  const durationPenalty = Math.min(avgDeviation * 10, 40); // Max 40 points penalty
  
  const score = Math.max(0, 100 - onsetPenalty - wakePenalty - durationPenalty);
  return Math.round(score);
}

function computeCircadianStability(analyses: DailyAnalysis[]): string {
  // Based on sleep midpoint consistency
  const midpoints = analyses.map(a => {
    const onsetMins = a.sleepOnset.getHours() * 60 + a.sleepOnset.getMinutes();
    const wakeMins = a.wakeTime.getHours() * 60 + a.wakeTime.getMinutes();
    let midpoint = (onsetMins + wakeMins) / 2;
    if (wakeMins < onsetMins) {
      midpoint = ((onsetMins + (wakeMins + 24 * 60)) / 2) % (24 * 60);
    }
    return midpoint;
  });
  
  const mean = midpoints.reduce((sum, m) => sum + m, 0) / midpoints.length;
  const variance = midpoints.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) / midpoints.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev < 30) return 'Stable';
  if (stdDev < 60) return 'Moderate';
  return 'Unstable';
}

function classifyChronotype(avgSleepOnset: string): string {
  const onsetHour = getMinutesFromTime(avgSleepOnset) / 60;
  
  // Adjust for times after midnight (0-6 AM should be treated as late night)
  const adjustedHour = onsetHour < 6 ? onsetHour + 24 : onsetHour;
  
  if (adjustedHour < 22.5) return 'Morning type'; // Before 10:30 PM
  if (adjustedHour <= 24.5) return 'Intermediate'; // 10:30 PM - 12:30 AM
  return 'Evening type'; // After 12:30 AM
}

function computeSleepDebt(analyses: DailyAnalysis[]): number {
  const totalIdeal = IDEAL_SLEEP_HOURS * analyses.length;
  const totalActual = analyses.reduce((sum, a) => sum + a.duration, 0);
  const debt = totalIdeal - totalActual;
  return Math.round(debt * 10) / 10; // Round to 1 decimal
}

function computeNightDisruptionFrequency(days: DailySleepInput[]): number {
  const totalChecks = days.reduce((sum, day) => sum + (day.nightChecks?.length || 0), 0);
  return Math.round((totalChecks / days.length) * 10) / 10; // Round to 1 decimal
}

function identifyRiskIndicators(analyses: DailyAnalysis[], days: DailySleepInput[]): string[] {
  const risks: string[] = [];
  
  // Sleep < 6 hours for 3+ consecutive days
  let consecutiveShortSleep = 0;
  let maxConsecutiveShortSleep = 0;
  for (const analysis of analyses) {
    if (analysis.duration < 6) {
      consecutiveShortSleep++;
      maxConsecutiveShortSleep = Math.max(maxConsecutiveShortSleep, consecutiveShortSleep);
    } else {
      consecutiveShortSleep = 0;
    }
  }
  if (maxConsecutiveShortSleep >= 3) {
    risks.push('Pattern suggests insufficient sleep duration (< 6 hours) for multiple consecutive days');
  }
  
  // Wake variability > 90 minutes
  const wakeMinutes = analyses.map(a => a.wakeTime.getHours() * 60 + a.wakeTime.getMinutes());
  const wakeMean = wakeMinutes.reduce((sum, m) => sum + m, 0) / wakeMinutes.length;
  const wakeVariance = wakeMinutes.reduce((sum, m) => sum + Math.pow(m - wakeMean, 2), 0) / wakeMinutes.length;
  const wakeStdDev = Math.sqrt(wakeVariance);
  if (wakeStdDev > 90) {
    risks.push('Data indicates high wake time variability (> 90 minutes), which may affect circadian rhythm');
  }
  
  // Night phone use between 2-4 AM frequently
  const nightChecks2to4AM = days.filter(day => {
    if (!day.nightChecks) return false;
    return day.nightChecks.some(check => {
      const hour = getMinutesFromTime(check.time) / 60;
      return hour >= 2 && hour < 4;
    });
  });
  if (nightChecks2to4AM.length >= days.length * 0.3) { // 30% or more nights
    risks.push('Pattern suggests frequent phone use during deep sleep window (2-4 AM)');
  }
  
  // Sleep onset after 2 AM regularly
  const lateOnsets = analyses.filter(a => {
    const hour = a.sleepOnset.getHours();
    return hour >= 2 && hour < 6;
  });
  if (lateOnsets.length >= analyses.length * 0.4) { // 40% or more nights
    risks.push('Data indicates regularly delayed sleep onset (after 2 AM)');
  }
  
  return risks;
}

function computeAdvancedMetrics(
  analyses: DailyAnalysis[],
  wakeTarget: string,
  sleepDebt: number
): {
  remCycleTiming: string[];
  idealBedtimeWindow: string;
  recoveryProjection: string;
} {
  // REM cycle timing (90-minute cycle model)
  const avgDuration = analyses.reduce((sum, a) => sum + a.duration, 0) / analyses.length;
  const cycles = Math.round(avgDuration / 1.5); // 90 min = 1.5 hours
  const remCycleTiming: string[] = [];
  for (let i = 1; i <= cycles; i++) {
    remCycleTiming.push(`Cycle ${i}: ~${Math.round(i * 90)} minutes`);
  }
  
  // Ideal bedtime window based on wake target
  const wakeTargetMins = getMinutesFromTime(wakeTarget);
  const idealSleepDurationMins = IDEAL_SLEEP_HOURS * 60;
  const idealBedtimeMins = (wakeTargetMins - idealSleepDurationMins - INACTIVITY_THRESHOLD_MINUTES + 24 * 60) % (24 * 60);
  const idealBedtimeWindow = `${minutesToHoursMinutes(idealBedtimeMins)} - ${minutesToHoursMinutes((idealBedtimeMins + 30) % (24 * 60))}`;
  
  // Recovery projection (conservative: 1 hour per 2 nights)
  const recoveryRate = 0.5; // hours per night
  const nightsToRecover = Math.abs(sleepDebt) / recoveryRate;
  const recoveryProjection = sleepDebt > 0
    ? `May benefit from approximately ${Math.ceil(nightsToRecover)} nights of adequate sleep to address estimated sleep debt (conservative estimate: ~0.5 hours recovery per night)`
    : sleepDebt < 0
    ? `Data suggests sleep surplus; current pattern appears sustainable`
    : `Sleep balance appears neutral`;
  
  return {
    remCycleTiming,
    idealBedtimeWindow,
    recoveryProjection,
  };
}
