// Deterministic guidance generator mapping conditions to structured guidance

import { Condition } from './conditions';
import { ExtendedMentalHealthProfile } from '../../../backend';
import { getPersonalizationContext } from '../../../utils/personalization';

export interface TherapyApproach {
  name: string;
  whyEffective: string;
  coreTechniques: string[];
  howToStartInApp: {
    description: string;
    moduleId?: string;
    toolName?: string;
  }[];
}

export interface GuidanceOutput {
  conditionSummary: string;
  therapyApproaches: TherapyApproach[];
  dailyPractices: string[];
  nutritionConsiderations: {
    generalPrinciples: string[];
    specificNutrients: string[];
    avoidOrMonitor: string[];
  };
  redFlags: string[];
  disclaimer: string;
}

/**
 * Generate structured guidance for a condition with optional personalization
 */
export function generateGuidance(condition: Condition, profile?: ExtendedMentalHealthProfile | null): GuidanceOutput {
  const baseGuidance = getBaseGuidance(condition);
  
  // Apply deterministic personalization if profile is complete
  if (profile) {
    const context = getPersonalizationContext(profile);
    return personalizeGuidance(baseGuidance, context);
  }
  
  return baseGuidance;
}

/**
 * Deterministically personalize guidance based on profile context
 */
function personalizeGuidance(
  guidance: GuidanceOutput,
  context: { age?: number; profession: string; goalsSummary: string }
): GuidanceOutput {
  const personalized = { ...guidance };
  
  // Age-appropriate examples
  if (context.age) {
    if (context.age < 25) {
      personalized.dailyPractices = [
        ...personalized.dailyPractices,
        'Consider peer support groups for young adults',
      ];
    } else if (context.age > 60) {
      personalized.dailyPractices = [
        ...personalized.dailyPractices,
        'Gentle movement practices adapted for your age group',
      ];
    }
  }
  
  // Profession-relevant stressors
  if (context.profession.includes('student')) {
    personalized.dailyPractices = [
      'Schedule study breaks with mindfulness exercises',
      ...personalized.dailyPractices,
    ];
  } else if (context.profession.includes('engineer') || context.profession.includes('software')) {
    personalized.dailyPractices = [
      'Take screen breaks every 90 minutes',
      ...personalized.dailyPractices,
    ];
  } else if (context.profession.includes('doctor') || context.profession.includes('nurse')) {
    personalized.dailyPractices = [
      'Decompression routine after shifts',
      ...personalized.dailyPractices,
    ];
  } else if (context.profession.includes('teacher')) {
    personalized.dailyPractices = [
      'Boundary-setting practices for work-life balance',
      ...personalized.dailyPractices,
    ];
  }
  
  // Goal-aligned priorities (non-diagnostic)
  if (context.goalsSummary) {
    personalized.conditionSummary += ` As you work toward your goals (${context.goalsSummary}), these strategies may help you maintain balance.`;
  }
  
  return personalized;
}

/**
 * Get base guidance for a condition (non-personalized)
 */
function getBaseGuidance(condition: Condition): GuidanceOutput {
  const guidanceMap: Record<string, GuidanceOutput> = {
    gad: {
      conditionSummary: 'If you\'ve been told you have Generalized Anxiety Disorder, you may experience excessive, uncontrollable worry across multiple areas of life, often accompanied by muscle tension, sleep disturbance, and cognitive fatigue.',
      therapyApproaches: [
        {
          name: 'Cognitive Behavioral Therapy (CBT)',
          whyEffective: 'CBT reduces maladaptive worry patterns and cognitive distortions that maintain anxiety.',
          coreTechniques: ['Cognitive restructuring', 'Worry exposure', 'Probability re-estimation', 'Behavioral experiments'],
          howToStartInApp: [
            { description: 'Complete daily thought record in Journal', toolName: 'Journal' },
            { description: 'Track worry patterns in Daily Log', toolName: 'Daily Log' },
          ],
        },
        {
          name: 'Metacognitive Therapy (MCT)',
          whyEffective: 'Targets repetitive worry processes rather than specific thoughts.',
          coreTechniques: ['Detached mindfulness', 'Postponement of worry', 'Rumination interruption'],
          howToStartInApp: [
            { description: 'Practice MCT techniques', moduleId: 'mct-detached-mindfulness' },
          ],
        },
      ],
      dailyPractices: [
        '5-minute paced breathing twice daily',
        'Limit reassurance-seeking behaviors',
        'Sleep consistency tracking',
        'Progressive muscle relaxation',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Maintain stable blood glucose', 'Reduce caffeine intake', 'Ensure adequate hydration'],
        specificNutrients: ['Magnesium-rich foods', 'Omega-3 fatty acids', 'B-complex vitamins'],
        avoidOrMonitor: ['High caffeine', 'Excess alcohol', 'Highly processed sugar spikes'],
      },
      redFlags: [
        'Panic attacks increasing in frequency',
        'Avoidance causing functional impairment',
        'Sleep disruption lasting more than two weeks',
        'Thoughts of self-harm',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. If you have not been formally diagnosed, please consult a qualified clinician.',
    },
    
    'panic-disorder': {
      conditionSummary: 'If you\'ve been told you have Panic Disorder, you may experience recurrent, unexpected panic attacks and persistent worry about future attacks.',
      therapyApproaches: [
        {
          name: 'Cognitive Behavioral Therapy (CBT)',
          whyEffective: 'CBT addresses catastrophic misinterpretations of bodily sensations that trigger panic.',
          coreTechniques: ['Interoceptive exposure', 'Cognitive restructuring', 'Safety behavior elimination'],
          howToStartInApp: [
            { description: 'Log panic symptoms in Daily Log', toolName: 'Daily Log' },
            { description: 'Practice grounding exercises', moduleId: 'trauma-grounding' },
          ],
        },
      ],
      dailyPractices: [
        'Controlled breathing exercises',
        'Body scan meditation',
        'Gradual exposure to feared situations',
        'Track panic triggers',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Avoid stimulants', 'Regular meal timing', 'Stay hydrated'],
        specificNutrients: ['Magnesium', 'Omega-3s', 'Vitamin D'],
        avoidOrMonitor: ['Caffeine', 'Alcohol', 'High sugar intake'],
      },
      redFlags: [
        'Panic attacks occurring daily',
        'Severe agoraphobia developing',
        'Unable to leave home',
        'Suicidal thoughts',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. If you have not been formally diagnosed, please consult a qualified clinician.',
    },
    
    mdd: {
      conditionSummary: 'If you\'ve been told you have Major Depressive Disorder, you may experience persistent low mood, loss of interest, fatigue, and difficulty with concentration.',
      therapyApproaches: [
        {
          name: 'Behavioral Activation',
          whyEffective: 'Increases engagement with rewarding activities to counter withdrawal and low mood.',
          coreTechniques: ['Activity scheduling', 'Graded task assignment', 'Mood-activity monitoring'],
          howToStartInApp: [
            { description: 'Track daily activities and mood', toolName: 'Daily Log' },
            { description: 'Set small behavioral goals', toolName: 'Interventions' },
          ],
        },
        {
          name: 'Cognitive Therapy',
          whyEffective: 'Addresses negative automatic thoughts and core beliefs maintaining depression.',
          coreTechniques: ['Thought records', 'Evidence examination', 'Behavioral experiments'],
          howToStartInApp: [
            { description: 'Journal cognitive patterns', toolName: 'Journal' },
          ],
        },
      ],
      dailyPractices: [
        'Morning routine with light exposure',
        'Physical activity (even 10 minutes)',
        'Social connection attempts',
        'Sleep hygiene practices',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Regular meals', 'Anti-inflammatory diet', 'Adequate protein'],
        specificNutrients: ['Omega-3 fatty acids', 'Folate', 'Vitamin D', 'B12'],
        avoidOrMonitor: ['Excessive alcohol', 'High processed foods', 'Irregular eating'],
      },
      redFlags: [
        'Suicidal thoughts or plans',
        'Severe weight loss or gain',
        'Inability to perform basic self-care',
        'Psychotic symptoms',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. If you have not been formally diagnosed, please consult a qualified clinician.',
    },
    
    ptsd: {
      conditionSummary: 'If you\'ve been told you have PTSD, you may experience intrusive memories, avoidance, negative mood changes, and hyperarousal following trauma exposure.',
      therapyApproaches: [
        {
          name: 'Trauma-Focused CBT',
          whyEffective: 'Processes traumatic memories and reduces avoidance behaviors.',
          coreTechniques: ['Exposure therapy', 'Cognitive processing', 'Trauma narrative'],
          howToStartInApp: [
            { description: 'Practice grounding techniques', moduleId: 'trauma-grounding' },
            { description: 'Track triggers and responses', toolName: 'Daily Log' },
          ],
        },
      ],
      dailyPractices: [
        'Grounding exercises when triggered',
        'Sleep routine maintenance',
        'Physical exercise',
        'Mindfulness practices',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Stable blood sugar', 'Reduce stimulants', 'Anti-inflammatory foods'],
        specificNutrients: ['Omega-3s', 'Magnesium', 'Vitamin C'],
        avoidOrMonitor: ['Caffeine', 'Alcohol', 'High sugar'],
      },
      redFlags: [
        'Flashbacks increasing in intensity',
        'Self-harm behaviors',
        'Substance abuse developing',
        'Suicidal ideation',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. PTSD requires professional treatment. If you have not been formally diagnosed, please consult a qualified clinician.',
    },
    
    ocd: {
      conditionSummary: 'If you\'ve been told you have OCD, you may experience intrusive thoughts (obsessions) and repetitive behaviors (compulsions) that cause significant distress.',
      therapyApproaches: [
        {
          name: 'Exposure and Response Prevention (ERP)',
          whyEffective: 'Breaks the cycle between obsessions and compulsions through gradual exposure.',
          coreTechniques: ['Hierarchy building', 'Exposure exercises', 'Response prevention', 'Habituation'],
          howToStartInApp: [
            { description: 'Track obsessions and compulsions', toolName: 'Daily Log' },
            { description: 'Build exposure hierarchy', toolName: 'Interventions' },
          ],
        },
      ],
      dailyPractices: [
        'Daily ERP practice',
        'Mindfulness meditation',
        'Delay compulsion urges',
        'Track anxiety levels',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Balanced diet', 'Reduce stimulants', 'Regular meals'],
        specificNutrients: ['Inositol', 'N-acetylcysteine', 'Omega-3s'],
        avoidOrMonitor: ['High caffeine', 'Alcohol', 'Irregular eating'],
      },
      redFlags: [
        'Compulsions taking hours per day',
        'Severe functional impairment',
        'Self-harm rituals',
        'Suicidal thoughts',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. OCD typically requires specialized treatment. If you have not been formally diagnosed, please consult a qualified clinician.',
    },
    
    'social-anxiety': {
      conditionSummary: 'If you\'ve been told you have Social Anxiety Disorder, you may experience intense fear of social situations and worry about being judged or embarrassed.',
      therapyApproaches: [
        {
          name: 'Cognitive Behavioral Therapy (CBT)',
          whyEffective: 'Addresses negative beliefs about social performance and reduces avoidance.',
          coreTechniques: ['Cognitive restructuring', 'Social exposure', 'Video feedback', 'Attention training'],
          howToStartInApp: [
            { description: 'Track social situations and anxiety', toolName: 'Daily Log' },
            { description: 'Challenge negative thoughts', toolName: 'Journal' },
          ],
        },
      ],
      dailyPractices: [
        'Gradual social exposure',
        'Self-compassion exercises',
        'Breathing techniques before social events',
        'Post-event processing reduction',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Reduce caffeine', 'Stable blood sugar', 'Hydration'],
        specificNutrients: ['Magnesium', 'Omega-3s', 'B vitamins'],
        avoidOrMonitor: ['High caffeine', 'Alcohol as coping', 'Energy drinks'],
      },
      redFlags: [
        'Complete social isolation',
        'Unable to work or attend school',
        'Substance abuse developing',
        'Suicidal thoughts',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. If you have not been formally diagnosed, please consult a qualified clinician.',
    },
    
    bipolar: {
      conditionSummary: 'If you\'ve been told you have Bipolar Disorder, you may experience episodes of elevated mood (mania/hypomania) and depression.',
      therapyApproaches: [
        {
          name: 'Interpersonal and Social Rhythm Therapy (IPSRT)',
          whyEffective: 'Stabilizes daily routines and sleep-wake cycles to prevent mood episodes.',
          coreTechniques: ['Social rhythm tracking', 'Interpersonal problem-solving', 'Routine stabilization'],
          howToStartInApp: [
            { description: 'Track sleep and daily rhythms', toolName: 'Daily Log' },
            { description: 'Monitor mood patterns', toolName: 'Daily Log' },
          ],
        },
      ],
      dailyPractices: [
        'Consistent sleep-wake schedule',
        'Mood and energy tracking',
        'Medication adherence',
        'Avoid sleep deprivation',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Regular meal times', 'Avoid stimulants', 'Stable routine'],
        specificNutrients: ['Omega-3s', 'Folate', 'Vitamin D'],
        avoidOrMonitor: ['Caffeine', 'Alcohol', 'Irregular eating'],
      },
      redFlags: [
        'Manic symptoms emerging',
        'Severe depression',
        'Suicidal thoughts',
        'Psychotic symptoms',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. Bipolar Disorder requires ongoing medical management. If you have not been formally diagnosed, please consult a qualified clinician.',
    },
    
    burnout: {
      conditionSummary: 'If you\'re experiencing burnout, you may feel emotionally exhausted, cynical about work, and have reduced professional efficacy.',
      therapyApproaches: [
        {
          name: 'Burnout Recovery Protocol',
          whyEffective: 'Addresses the three core dimensions of burnout through structured intervention.',
          coreTechniques: ['Energy management', 'Boundary setting', 'Values clarification', 'Workload restructuring'],
          howToStartInApp: [
            { description: 'Complete burnout recovery module', moduleId: 'burnout-recovery' },
            { description: 'Track energy and stress', toolName: 'Daily Log' },
          ],
        },
      ],
      dailyPractices: [
        'Set clear work boundaries',
        'Regular breaks during work',
        'Physical activity',
        'Social connection outside work',
      ],
      nutritionConsiderations: {
        generalPrinciples: ['Anti-inflammatory diet', 'Regular meals', 'Reduce stimulants'],
        specificNutrients: ['B vitamins', 'Magnesium', 'Adaptogens (with caution)'],
        avoidOrMonitor: ['Excessive caffeine', 'Alcohol as coping', 'Skipping meals'],
      },
      redFlags: [
        'Severe depression developing',
        'Suicidal thoughts',
        'Complete inability to work',
        'Substance abuse',
      ],
      disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. Severe burnout may require medical leave and professional support.',
    }
  };
  
  return guidanceMap[condition.id] || {
    conditionSummary: `Educational information about ${condition.name} is being developed.`,
    therapyApproaches: [],
    dailyPractices: ['Track symptoms in Daily Log', 'Practice self-care', 'Seek professional guidance'],
    nutritionConsiderations: {
      generalPrinciples: ['Balanced diet', 'Regular meals', 'Adequate hydration'],
      specificNutrients: ['Whole foods', 'Omega-3s', 'B vitamins'],
      avoidOrMonitor: ['Excessive caffeine', 'Alcohol', 'Processed foods'],
    },
    redFlags: ['Worsening symptoms', 'Functional impairment', 'Thoughts of self-harm'],
    disclaimer: 'This guidance is educational and does not replace care from a licensed mental health professional. Please consult a qualified clinician for diagnosis and treatment.',
  };
}
