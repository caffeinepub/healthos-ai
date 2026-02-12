import { DailyLog, WeeklyAnalytics } from '../../../backend';

export function computeLocalWeeklyAnalytics(logs: DailyLog[]): WeeklyAnalytics {
  if (logs.length === 0) {
    return {
      stressLoad: 0,
      burnoutIndex: 0,
      emotionalStability: 0,
      cognitiveFatigue: 0,
      sleepMoodCorrelation: 0,
      moodVolatility: 0,
      riskForecast: 0,
    };
  }

  const size = logs.length;
  let stressSum = 0;
  let productivitySum = 0;
  let moodSum = 0;
  let energySum = 0;
  let sleepSum = 0;

  for (const log of logs) {
    stressSum += Number(log.stressRating);
    productivitySum += Number(log.productivity);
    moodSum += Number(log.mood);
    energySum += Number(log.energyLevel);
    sleepSum += log.sleepHours;
  }

  const stressLoad = stressSum / size;
  const burnoutIndex = (10 - productivitySum / size) / 10;
  const emotionalStability = moodSum / size;
  const cognitiveFatigue = (10 - energySum / size) / 10;
  const sleepMoodCorrelation = sleepSum / size;

  // Mood volatility (standard deviation)
  const avgMood = moodSum / size;
  let moodVariance = 0;
  for (const log of logs) {
    const diff = Number(log.mood) - avgMood;
    moodVariance += diff * diff;
  }
  const moodVolatility = Math.sqrt(moodVariance / size);

  // Risk forecast (simple average of negative indicators)
  const riskForecast = (stressLoad + burnoutIndex + cognitiveFatigue) / 3;

  return {
    stressLoad,
    burnoutIndex,
    emotionalStability,
    cognitiveFatigue,
    sleepMoodCorrelation,
    moodVolatility,
    riskForecast,
  };
}

export function interpretCorrelation(value: number): string {
  if (value < 0.3) return 'Weak';
  if (value < 0.6) return 'Moderate';
  return 'Strong';
}
