export type TherapyLayer = 'stabilization' | 'symptom-reduction' | 'behavioral-restructuring' | 'psychological-flexibility' | 'long-term-growth';

export interface TherapyLayerInfo {
  id: TherapyLayer;
  name: string;
  description: string;
  order: number;
  color: string;
}

export interface ExistingTool {
  id: string;
  name: string;
  description: string;
  path?: string;
}

export interface TherapyModule {
  id: string;
  name: string;
  description: string;
  layer: TherapyLayer;
  isOptional?: boolean;
  isElite?: boolean;
  disclaimer?: string;
}

export const THERAPY_LAYERS: TherapyLayerInfo[] = [
  {
    id: 'stabilization',
    name: 'Layer 1: Stabilization',
    description: 'Foundation for safety, grounding, and basic emotional regulation',
    order: 1,
    color: 'blue',
  },
  {
    id: 'symptom-reduction',
    name: 'Layer 2: Symptom Reduction',
    description: 'Evidence-based interventions to reduce anxiety, depression, and stress',
    order: 2,
    color: 'green',
  },
  {
    id: 'behavioral-restructuring',
    name: 'Layer 3: Behavioral Restructuring',
    description: 'Build healthy habits and break unhelpful patterns',
    order: 3,
    color: 'amber',
  },
  {
    id: 'psychological-flexibility',
    name: 'Layer 4: Psychological Flexibility',
    description: 'Develop acceptance, mindfulness, and values-driven action',
    order: 4,
    color: 'purple',
  },
  {
    id: 'long-term-growth',
    name: 'Layer 5: Long-Term Growth',
    description: 'Sustained well-being, performance optimization, and meaning',
    order: 5,
    color: 'pink',
  },
];

export const EXISTING_TOOLS_BY_LAYER: Record<TherapyLayer, ExistingTool[]> = {
  'stabilization': [
    { id: 'crisis-safety', name: 'Crisis Safety Plan', description: 'Emergency contacts and coping strategies' },
    { id: 'grounding', name: 'Grounding Techniques', description: 'Trauma-informed stabilization exercises' },
    { id: 'sleep-tracking', name: 'Sleep Tracking', description: 'Monitor sleep patterns and quality' },
  ],
  'symptom-reduction': [
    { id: 'assessments', name: 'Clinical Assessments', description: 'PHQ-9, GAD-7, and burnout screening' },
    { id: 'cbt-journal', name: 'CBT Journal', description: 'Cognitive distortion identification and reframing' },
    { id: 'daily-tracking', name: 'Daily Mood Tracking', description: 'Log emotions, stress, and energy levels' },
  ],
  'behavioral-restructuring': [
    { id: 'behavioral-activation', name: 'Behavioral Activation', description: 'Activity scheduling and avoidance mapping' },
    { id: 'habit-reversal', name: 'Habit Reversal', description: 'Break impulse patterns and build replacements' },
    { id: 'interventions', name: 'Active Interventions', description: 'Track ongoing therapeutic exercises' },
  ],
  'psychological-flexibility': [
    { id: 'act-modules', name: 'ACT Exercises', description: 'Values clarification and committed action' },
    { id: 'mindfulness', name: 'Mindfulness Practice', description: 'MBCT-based meditation and awareness' },
    { id: 'dbt-skills', name: 'DBT Skills', description: 'Emotion regulation and distress tolerance' },
  ],
  'long-term-growth': [
    { id: 'weekly-analytics', name: 'Weekly Analytics', description: 'Track trends and forecast risk' },
    { id: 'performance-psych', name: 'Performance Psychology', description: 'Mental rehearsal and attention control (Optional)' },
    { id: 'burnout-recovery', name: 'Burnout Recovery', description: '4-phase recovery protocol (Optional)' },
  ],
};

export const ALL_THERAPY_MODULES: TherapyModule[] = [
  {
    id: 'act-values',
    name: 'ACT: Values Clarification',
    description: 'Identify your core values and align actions with what matters most',
    layer: 'psychological-flexibility',
  },
  {
    id: 'act-defusion',
    name: 'ACT: Cognitive Defusion',
    description: 'Learn to observe thoughts without being controlled by them',
    layer: 'psychological-flexibility',
  },
  {
    id: 'act-committed-action',
    name: 'ACT: Committed Action',
    description: 'Set values-based goals and take meaningful steps forward',
    layer: 'psychological-flexibility',
  },
  {
    id: 'dbt-distress-tolerance',
    name: 'DBT: Distress Tolerance',
    description: 'Skills-only module for managing intense emotions without making things worse',
    layer: 'stabilization',
    disclaimer: 'This is a skills-based module, not full DBT therapy. For comprehensive DBT, consult a trained clinician.',
  },
  {
    id: 'dbt-emotion-regulation',
    name: 'DBT: Emotion Regulation',
    description: 'Understand and manage emotional responses effectively',
    layer: 'symptom-reduction',
    disclaimer: 'This is a skills-based module, not full DBT therapy.',
  },
  {
    id: 'dbt-interpersonal',
    name: 'DBT: Interpersonal Effectiveness',
    description: 'Communicate needs and set boundaries while maintaining relationships',
    layer: 'behavioral-restructuring',
    disclaimer: 'This is a skills-based module, not full DBT therapy.',
  },
  {
    id: 'dbt-crisis-survival',
    name: 'DBT: Crisis Survival Skills',
    description: 'Emergency techniques for getting through crisis moments safely',
    layer: 'stabilization',
    disclaimer: 'This is a skills-based module, not full DBT therapy. In acute crisis, contact emergency services.',
  },
  {
    id: 'mbct-body-scan',
    name: 'MBCT: Body Scan',
    description: 'Systematic mindfulness practice for body awareness',
    layer: 'psychological-flexibility',
  },
  {
    id: 'mbct-breath-anchor',
    name: 'MBCT: Breath Anchoring',
    description: 'Use breath as an anchor for present-moment awareness',
    layer: 'psychological-flexibility',
  },
  {
    id: 'mbct-urge-surfing',
    name: 'MBCT: Urge Surfing',
    description: 'Ride out cravings and impulses without acting on them',
    layer: 'behavioral-restructuring',
  },
  {
    id: 'mbct-decentering',
    name: 'MBCT: Cognitive Decentering',
    description: 'Observe thoughts as mental events, not facts',
    layer: 'psychological-flexibility',
  },
  {
    id: 'mct-rumination',
    name: 'MCT: Rumination Reduction',
    description: 'Break the cycle of repetitive negative thinking',
    layer: 'symptom-reduction',
  },
  {
    id: 'mct-worry-postponement',
    name: 'MCT: Worry Postponement',
    description: 'Schedule worry time to reduce constant anxiety',
    layer: 'symptom-reduction',
  },
  {
    id: 'mct-detached-mindfulness',
    name: 'MCT: Detached Mindfulness',
    description: 'Observe thoughts without engaging or suppressing them',
    layer: 'psychological-flexibility',
  },
  {
    id: 'cft-self-compassion',
    name: 'CFT: Self-Compassion Scripts',
    description: 'Develop a kinder, more supportive inner voice',
    layer: 'symptom-reduction',
  },
  {
    id: 'cft-inner-critic',
    name: 'CFT: Inner Critic Reframe',
    description: 'Transform harsh self-criticism into constructive self-support',
    layer: 'symptom-reduction',
  },
  {
    id: 'cft-compassion-imagery',
    name: 'CFT: Compassion Imagery',
    description: 'Use visualization to cultivate self-compassion',
    layer: 'psychological-flexibility',
  },
  {
    id: 'sfbt-miracle-question',
    name: 'SFBT: Miracle Question',
    description: 'Envision your ideal future to clarify goals',
    layer: 'long-term-growth',
  },
  {
    id: 'sfbt-scaling',
    name: 'SFBT: Scaling Questions',
    description: 'Measure progress and identify next steps',
    layer: 'behavioral-restructuring',
  },
  {
    id: 'sfbt-strengths',
    name: 'SFBT: Strength Identification',
    description: 'Recognize and leverage your existing resources',
    layer: 'long-term-growth',
  },
  {
    id: 'performance-mental-rehearsal',
    name: 'Performance: Mental Rehearsal',
    description: 'Visualize success to enhance performance',
    layer: 'long-term-growth',
    isOptional: true,
    isElite: true,
  },
  {
    id: 'performance-confidence-priming',
    name: 'Performance: Confidence Priming',
    description: 'Pre-performance routines to boost self-efficacy',
    layer: 'long-term-growth',
    isOptional: true,
    isElite: true,
  },
  {
    id: 'performance-attention-control',
    name: 'Performance: Attention Control',
    description: 'Train focus and manage distractions under pressure',
    layer: 'long-term-growth',
    isOptional: true,
    isElite: true,
  },
  {
    id: 'burnout-recovery',
    name: 'Burnout Recovery Protocol',
    description: '4-phase structured recovery from burnout',
    layer: 'long-term-growth',
    isOptional: true,
    isElite: true,
  },
  {
    id: 'trauma-grounding',
    name: 'Trauma-Informed Grounding',
    description: 'Stabilization techniques and window of tolerance education',
    layer: 'stabilization',
    disclaimer: 'This module provides grounding and stabilization only. It does not process trauma. For trauma therapy, consult a qualified clinician.',
  },
  {
    id: 'cbti-sleep-efficiency',
    name: 'CBT-I: Sleep Efficiency',
    description: 'Cognitive-behavioral techniques for better sleep',
    layer: 'behavioral-restructuring',
  },
  {
    id: 'habit-reversal-impulse',
    name: 'Habit Reversal: Impulse Control',
    description: 'Identify triggers and build replacement behaviors',
    layer: 'behavioral-restructuring',
  },
];
