// Curated condition catalog with IDs, display names, and aliases for matching

export interface Condition {
  id: string;
  name: string;
  aliases: string[];
  category: 'anxiety' | 'mood' | 'trauma' | 'eating' | 'substance' | 'psychotic' | 'other';
  riskLevel: 'standard' | 'high-risk';
}

export const CONDITIONS: Condition[] = [
  // Anxiety Disorders
  {
    id: 'gad',
    name: 'Generalized Anxiety Disorder',
    aliases: ['gad', 'generalized anxiety', 'chronic worry', 'excessive worry'],
    category: 'anxiety',
    riskLevel: 'standard',
  },
  {
    id: 'panic-disorder',
    name: 'Panic Disorder',
    aliases: ['panic disorder', 'panic attacks', 'panic'],
    category: 'anxiety',
    riskLevel: 'standard',
  },
  {
    id: 'social-anxiety',
    name: 'Social Anxiety Disorder',
    aliases: ['social anxiety', 'social phobia', 'social anxiety disorder'],
    category: 'anxiety',
    riskLevel: 'standard',
  },
  {
    id: 'ocd',
    name: 'Obsessive-Compulsive Disorder',
    aliases: ['ocd', 'obsessive compulsive', 'obsessive-compulsive disorder'],
    category: 'anxiety',
    riskLevel: 'standard',
  },
  {
    id: 'ptsd',
    name: 'Post-Traumatic Stress Disorder',
    aliases: ['ptsd', 'post traumatic stress', 'trauma', 'post-traumatic stress disorder'],
    category: 'trauma',
    riskLevel: 'standard',
  },
  
  // Mood Disorders
  {
    id: 'depression',
    name: 'Major Depressive Disorder',
    aliases: ['depression', 'major depression', 'clinical depression', 'depressive disorder'],
    category: 'mood',
    riskLevel: 'standard',
  },
  {
    id: 'bipolar',
    name: 'Bipolar Disorder',
    aliases: ['bipolar', 'bipolar disorder', 'manic depression', 'mania'],
    category: 'mood',
    riskLevel: 'high-risk',
  },
  {
    id: 'persistent-depressive',
    name: 'Persistent Depressive Disorder',
    aliases: ['dysthymia', 'persistent depressive disorder', 'chronic depression'],
    category: 'mood',
    riskLevel: 'standard',
  },
  
  // Eating Disorders
  {
    id: 'anorexia',
    name: 'Anorexia Nervosa',
    aliases: ['anorexia', 'anorexia nervosa'],
    category: 'eating',
    riskLevel: 'high-risk',
  },
  {
    id: 'bulimia',
    name: 'Bulimia Nervosa',
    aliases: ['bulimia', 'bulimia nervosa'],
    category: 'eating',
    riskLevel: 'high-risk',
  },
  {
    id: 'binge-eating',
    name: 'Binge Eating Disorder',
    aliases: ['binge eating', 'binge eating disorder', 'bed'],
    category: 'eating',
    riskLevel: 'standard',
  },
  
  // Substance Use
  {
    id: 'substance-use',
    name: 'Substance Use Disorder',
    aliases: ['substance use', 'addiction', 'substance abuse', 'drug addiction', 'alcohol addiction'],
    category: 'substance',
    riskLevel: 'high-risk',
  },
  
  // Psychotic Disorders
  {
    id: 'schizophrenia',
    name: 'Schizophrenia',
    aliases: ['schizophrenia', 'psychosis'],
    category: 'psychotic',
    riskLevel: 'high-risk',
  },
  
  // Other
  {
    id: 'adhd',
    name: 'Attention-Deficit/Hyperactivity Disorder',
    aliases: ['adhd', 'attention deficit', 'add', 'hyperactivity'],
    category: 'other',
    riskLevel: 'standard',
  },
  {
    id: 'burnout',
    name: 'Burnout Syndrome',
    aliases: ['burnout', 'work burnout', 'occupational burnout'],
    category: 'other',
    riskLevel: 'standard',
  },
  {
    id: 'adjustment-disorder',
    name: 'Adjustment Disorder',
    aliases: ['adjustment disorder', 'stress response', 'situational stress'],
    category: 'other',
    riskLevel: 'standard',
  },
];

export interface MatchResult {
  condition: Condition | null;
  confidence: 'high' | 'low' | 'none';
}

/**
 * Normalize user input for matching
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

/**
 * Attempt to match user input to a condition
 * Returns null if confidence is too low
 */
export function matchCondition(userInput: string): MatchResult {
  const normalized = normalizeText(userInput);
  
  if (!normalized) {
    return { condition: null, confidence: 'none' };
  }
  
  // Try exact match on name or aliases
  for (const condition of CONDITIONS) {
    const normalizedName = normalizeText(condition.name);
    if (normalizedName === normalized) {
      return { condition, confidence: 'high' };
    }
    
    for (const alias of condition.aliases) {
      const normalizedAlias = normalizeText(alias);
      if (normalizedAlias === normalized) {
        return { condition, confidence: 'high' };
      }
    }
  }
  
  // Try partial match (contains)
  for (const condition of CONDITIONS) {
    const normalizedName = normalizeText(condition.name);
    if (normalizedName.includes(normalized) || normalized.includes(normalizedName)) {
      return { condition, confidence: 'high' };
    }
    
    for (const alias of condition.aliases) {
      const normalizedAlias = normalizeText(alias);
      if (normalizedAlias.includes(normalized) || normalized.includes(normalizedAlias)) {
        return { condition, confidence: 'high' };
      }
    }
  }
  
  // No match found
  return { condition: null, confidence: 'none' };
}

/**
 * Get all conditions grouped by category
 */
export function getConditionsByCategory(): Record<string, Condition[]> {
  const grouped: Record<string, Condition[]> = {};
  
  for (const condition of CONDITIONS) {
    if (!grouped[condition.category]) {
      grouped[condition.category] = [];
    }
    grouped[condition.category].push(condition);
  }
  
  return grouped;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    anxiety: 'Anxiety Disorders',
    mood: 'Mood Disorders',
    trauma: 'Trauma & Stress',
    eating: 'Eating Disorders',
    substance: 'Substance Use',
    psychotic: 'Psychotic Disorders',
    other: 'Other Conditions',
  };
  return names[category] || category;
}
