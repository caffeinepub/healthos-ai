// Deterministic high-risk detection for safety gating

import { Condition } from './conditions';

export interface RiskAssessment {
  isHighRisk: boolean;
  triggers: string[];
  message: string;
}

const HIGH_RISK_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'self harm',
  'self-harm',
  'cutting',
  'overdose',
  'psychosis',
  'psychotic',
  'hallucination',
  'hearing voices',
  'delusion',
  'mania',
  'manic episode',
  'withdrawal',
  'detox',
  'severe eating disorder',
];

/**
 * Assess risk level based on condition and user input
 */
export function assessRisk(condition: Condition | null, userInput?: string): RiskAssessment {
  const triggers: string[] = [];
  
  // Check condition risk level
  if (condition?.riskLevel === 'high-risk') {
    triggers.push(`${condition.name} requires professional care`);
  }
  
  // Check user input for high-risk keywords
  if (userInput) {
    const normalized = userInput.toLowerCase();
    for (const keyword of HIGH_RISK_KEYWORDS) {
      if (normalized.includes(keyword)) {
        triggers.push(`Detected: ${keyword}`);
      }
    }
  }
  
  const isHighRisk = triggers.length > 0;
  
  let message = '';
  if (isHighRisk) {
    if (condition?.category === 'psychotic') {
      message = 'Psychotic disorders require specialized psychiatric care. Self-guided therapy is not appropriate for these conditions.';
    } else if (condition?.category === 'substance') {
      message = 'Substance use disorders and withdrawal require medical supervision. Please consult a healthcare provider or addiction specialist.';
    } else if (condition?.category === 'eating' && condition.riskLevel === 'high-risk') {
      message = 'Severe eating disorders require specialized treatment from eating disorder professionals. Self-guided therapy alone is not sufficient.';
    } else if (condition?.id === 'bipolar') {
      message = 'Bipolar disorder requires psychiatric evaluation and often medication management. Self-guided therapy should complement, not replace, professional care.';
    } else if (triggers.some(t => t.includes('suicide') || t.includes('self harm'))) {
      message = 'If you are experiencing thoughts of suicide or self-harm, please seek immediate help. You are not alone, and support is available.';
    } else {
      message = 'This condition requires professional evaluation and care. Self-guided resources should complement, not replace, professional treatment.';
    }
  }
  
  return {
    isHighRisk,
    triggers,
    message,
  };
}

/**
 * Check if immediate crisis intervention is needed
 */
export function needsImmediateCrisis(userInput?: string): boolean {
  if (!userInput) return false;
  
  const normalized = userInput.toLowerCase();
  const crisisKeywords = [
    'suicide',
    'suicidal',
    'kill myself',
    'end my life',
    'want to die',
    'self harm',
    'cutting',
    'overdose',
  ];
  
  return crisisKeywords.some(keyword => normalized.includes(keyword));
}
