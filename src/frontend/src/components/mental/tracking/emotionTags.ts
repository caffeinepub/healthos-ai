export const EMOTION_TAGS = [
  'Happy',
  'Sad',
  'Anxious',
  'Calm',
  'Angry',
  'Excited',
  'Tired',
  'Energetic',
  'Stressed',
  'Relaxed',
  'Frustrated',
  'Content',
  'Worried',
  'Hopeful',
  'Overwhelmed',
];

export function mergeCustomTags(selected: string[], custom: string[]): string[] {
  return [...new Set([...selected, ...custom])];
}
