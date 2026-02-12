import { AssessmentResult } from '../../../backend';

export interface AssessmentAnswers {
  [assessmentId: string]: {
    [questionId: string]: number | number[];
  };
}

export function computeAssessmentResult(answers: AssessmentAnswers): AssessmentResult {
  // PHQ-9 scoring (sum of 9 questions, 0-27)
  const phq9Answers = answers['phq9'] || {};
  const phq9Score = Object.values(phq9Answers).reduce((sum: number, val) => {
    const numVal = Array.isArray(val) ? val[0] : val;
    return sum + (typeof numVal === 'number' ? numVal : 0);
  }, 0);

  // GAD-7 scoring (sum of 7 questions, 0-21)
  const gad7Answers = answers['gad7'] || {};
  const gad7Score = Object.values(gad7Answers).reduce((sum: number, val) => {
    const numVal = Array.isArray(val) ? val[0] : val;
    return sum + (typeof numVal === 'number' ? numVal : 0);
  }, 0);

  // Burnout scoring (sum of 5 questions, 0-20, normalized to 0-1)
  const burnoutAnswers = answers['burnout'] || {};
  const burnoutSum = Object.values(burnoutAnswers).reduce((sum: number, val) => {
    const numVal = Array.isArray(val) ? val[0] : val;
    return sum + (typeof numVal === 'number' ? numVal : 0);
  }, 0);
  const burnoutScore = burnoutSum / 20;

  // Big Five (5 traits, each 1-5)
  const bigFiveAnswers = answers['bigfive'] || {};
  const bigFive = [
    typeof bigFiveAnswers['bigfive_1'] === 'number' ? bigFiveAnswers['bigfive_1'] : 3,
    6 - (typeof bigFiveAnswers['bigfive_2'] === 'number' ? bigFiveAnswers['bigfive_2'] : 3), // Reverse scored
    typeof bigFiveAnswers['bigfive_3'] === 'number' ? bigFiveAnswers['bigfive_3'] : 3,
    6 - (typeof bigFiveAnswers['bigfive_4'] === 'number' ? bigFiveAnswers['bigfive_4'] : 3), // Reverse scored
    typeof bigFiveAnswers['bigfive_5'] === 'number' ? bigFiveAnswers['bigfive_5'] : 3,
  ];

  // Sleep quality (sum of 4 questions, 0-12, normalized to 0-1)
  const sleepAnswers = answers['sleep'] || {};
  const sleepSum = Object.values(sleepAnswers).reduce((sum: number, val) => {
    const numVal = Array.isArray(val) ? val[0] : val;
    return sum + (typeof numVal === 'number' ? numVal : 0);
  }, 0);
  const sleepQualityScore = sleepSum / 12;

  // Coping style (most common response)
  const copingAnswers = answers['coping'] || {};
  const copingValues = Object.values(copingAnswers).map((val) => {
    const numVal = Array.isArray(val) ? val[0] : val;
    return typeof numVal === 'number' ? numVal : 3;
  });
  const copingMode = copingValues.sort((a, b) =>
    copingValues.filter((v) => v === a).length - copingValues.filter((v) => v === b).length
  )[copingValues.length - 1] || 3;
  const copingStyles = ['Avoidant', 'Social', 'Problem-solving', 'Relaxation'];
  const copingStyle = copingStyles[copingMode - 1] || 'Problem-solving';

  // Stress triggers (selected items)
  const triggersAnswers = answers['triggers'] || {};
  const triggerLabels = [
    'Work/Career',
    'Relationships',
    'Finances',
    'Health',
    'Family',
    'Social situations',
    'Time pressure',
    'Uncertainty',
  ];
  const triggerValue = triggersAnswers['triggers_1'];
  const triggerArray = Array.isArray(triggerValue) ? triggerValue : [];
  const stressTriggers = triggerArray.map((idx) => triggerLabels[idx - 1]).filter(Boolean);

  // Compute baseline score (0-100, higher is better)
  // Formula: 100 - (PHQ-9 normalized + GAD-7 normalized + burnout) / 3 * 100
  const baselineScore =
    100 - ((phq9Score / 27 + gad7Score / 21 + burnoutScore) / 3) * 100;

  // Personality profile (simplified)
  const personalityProfile = `Extraversion: ${bigFive[0]}, Agreeableness: ${6 - bigFive[1]}, Conscientiousness: ${bigFive[2]}, Neuroticism: ${6 - bigFive[3]}, Openness: ${bigFive[4]}`;

  // Stress reactivity type (based on neuroticism and coping)
  const neuroticism = 6 - bigFive[3];
  let stressReactivityType = 'Moderate';
  if (neuroticism >= 4 && copingMode === 1) {
    stressReactivityType = 'High';
  } else if (neuroticism <= 2 && copingMode >= 3) {
    stressReactivityType = 'Low';
  }

  return {
    phq9Score: BigInt(phq9Score),
    gad7Score: BigInt(gad7Score),
    burnoutScore,
    bigFive,
    sleepQualityScore,
    copingStyle,
    stressTriggers,
    baselineScore,
    personalityProfile,
    stressReactivityType,
    timestamp: BigInt(Date.now() * 1_000_000),
  };
}
