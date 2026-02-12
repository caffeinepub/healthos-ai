export interface JournalAnalysis {
  cognitiveDistortions: string[];
  emotionalIntensity: number;
  negativeBeliefs: boolean;
  catastrophizing: boolean;
  socraticPrompts: string[];
}

const DISTORTION_KEYWORDS = {
  'All-or-Nothing': ['always', 'never', 'every', 'none', 'completely'],
  'Overgeneralization': ['everyone', 'nobody', 'everything', 'nothing'],
  'Mental Filter': ['only', 'just', 'merely'],
  'Catastrophizing': ['disaster', 'terrible', 'awful', 'worst', 'ruined', 'doomed'],
  'Emotional Reasoning': ['feel like', 'feels', 'feeling'],
  'Should Statements': ['should', 'must', 'ought', 'have to'],
  'Labeling': ['I am a', 'I\'m a', 'loser', 'failure', 'idiot'],
  'Personalization': ['my fault', 'because of me', 'I caused'],
};

const NEGATIVE_BELIEF_KEYWORDS = ['worthless', 'useless', 'hopeless', 'helpless', 'unlovable', 'broken'];
const CATASTROPHIZING_KEYWORDS = ['disaster', 'terrible', 'awful', 'worst', 'ruined', 'doomed', 'end of'];

export function analyzeJournalEntry(content: string): JournalAnalysis {
  const lowerContent = content.toLowerCase();
  const distortions: string[] = [];

  // Detect cognitive distortions
  for (const [distortion, keywords] of Object.entries(DISTORTION_KEYWORDS)) {
    if (keywords.some((kw) => lowerContent.includes(kw))) {
      distortions.push(distortion);
    }
  }

  // Detect negative beliefs
  const negativeBeliefs = NEGATIVE_BELIEF_KEYWORDS.some((kw) => lowerContent.includes(kw));

  // Detect catastrophizing
  const catastrophizing = CATASTROPHIZING_KEYWORDS.some((kw) => lowerContent.includes(kw));

  // Estimate emotional intensity (1-10) based on keywords and punctuation
  let intensity = 5;
  const exclamations = (content.match(/!/g) || []).length;
  const capsWords = (content.match(/\b[A-Z]{2,}\b/g) || []).length;
  intensity += Math.min(exclamations, 2) + Math.min(capsWords, 2);
  if (negativeBeliefs) intensity += 1;
  if (catastrophizing) intensity += 1;
  intensity = Math.min(Math.max(intensity, 1), 10);

  // Generate Socratic prompts
  const prompts: string[] = [];
  if (distortions.includes('All-or-Nothing')) {
    prompts.push('Are there any exceptions to this absolute statement?');
  }
  if (distortions.includes('Catastrophizing')) {
    prompts.push('What is the most realistic outcome?');
  }
  if (distortions.includes('Should Statements')) {
    prompts.push('What would be a more flexible way to think about this?');
  }
  if (negativeBeliefs) {
    prompts.push('What evidence do you have that contradicts this belief?');
  }
  if (prompts.length === 0) {
    prompts.push('What are the facts of this situation?');
  }

  return {
    cognitiveDistortions: [...new Set(distortions)],
    emotionalIntensity: intensity,
    negativeBeliefs,
    catastrophizing,
    socraticPrompts: prompts,
  };
}
