// Deterministic optimization suggestion generator

import { SleepAnalysisOutput } from './types';

export function generateOptimizationSuggestions(analysis: SleepAnalysisOutput): string[] {
  const suggestions: string[] = [];
  
  // High wake variability
  if (analysis.riskIndicators.some(r => r.includes('wake time variability'))) {
    suggestions.push('May benefit from fixed wake time anchoring: Set a consistent wake time (including weekends) to stabilize circadian rhythm');
  }
  
  // Late-night phone use
  if (analysis.riskIndicators.some(r => r.includes('2-4 AM'))) {
    suggestions.push('Consider implementing a 60-minute digital sunset: Place phone in another room before sleep to reduce night disruptions');
  }
  
  // Late sleep onset
  if (analysis.riskIndicators.some(r => r.includes('delayed sleep onset'))) {
    suggestions.push('Pattern suggests gradual 15-minute bedtime shift: Move bedtime earlier by 15 minutes each week until reaching target');
  }
  
  // Short sleep duration
  if (analysis.riskIndicators.some(r => r.includes('insufficient sleep duration'))) {
    suggestions.push('Data indicates need for sleep extension: Aim to increase sleep opportunity by 30-60 minutes per night');
  }
  
  // Circadian instability
  if (analysis.circadianStability === 'Unstable' || analysis.circadianStability === 'Moderate') {
    suggestions.push('May benefit from morning sunlight exposure within 30 minutes of waking to strengthen circadian signals');
  }
  
  // Sleep debt
  if (analysis.sleepDebt > 3) {
    suggestions.push('Consider sleep recovery protocol: Prioritize 8-9 hours sleep opportunity for 1-2 weeks to address accumulated sleep debt');
  }
  
  // Night disruptions
  if (analysis.nightDisruptionFrequency > 1) {
    suggestions.push('Pattern suggests reducing sleep environment disruptions: Minimize phone checks and optimize bedroom conditions (dark, cool, quiet)');
  }
  
  // Default maintenance suggestions if no strong issues
  if (suggestions.length === 0) {
    suggestions.push('Current sleep pattern appears relatively stable; maintain consistent sleep-wake schedule');
    suggestions.push('Continue monitoring for changes in sleep quality or duration');
    suggestions.push('Consider blue light reduction 1-2 hours before bedtime to support natural melatonin production');
  }
  
  // Limit to 5 suggestions maximum
  return suggestions.slice(0, 5);
}
