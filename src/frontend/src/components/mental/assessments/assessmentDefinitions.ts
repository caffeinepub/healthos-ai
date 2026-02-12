export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface Assessment {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

// PHQ-9: Patient Health Questionnaire (Depression)
// Standard scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe
export const PHQ9: Assessment = {
  id: 'phq9',
  name: 'PHQ-9',
  description: 'Depression screening questionnaire',
  questions: [
    {
      id: 'phq9_1',
      text: 'Little interest or pleasure in doing things',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_2',
      text: 'Feeling down, depressed, or hopeless',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_3',
      text: 'Trouble falling or staying asleep, or sleeping too much',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_4',
      text: 'Feeling tired or having little energy',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_5',
      text: 'Poor appetite or overeating',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_6',
      text: 'Feeling bad about yourself or that you are a failure',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_7',
      text: 'Trouble concentrating on things',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_8',
      text: 'Moving or speaking slowly, or being fidgety or restless',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_9',
      text: 'Thoughts that you would be better off dead or hurting yourself',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
  ],
};

// GAD-7: Generalized Anxiety Disorder
// Standard scoring: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe
export const GAD7: Assessment = {
  id: 'gad7',
  name: 'GAD-7',
  description: 'Anxiety screening questionnaire',
  questions: [
    {
      id: 'gad7_1',
      text: 'Feeling nervous, anxious, or on edge',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_2',
      text: 'Not being able to stop or control worrying',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_3',
      text: 'Worrying too much about different things',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_4',
      text: 'Trouble relaxing',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_5',
      text: 'Being so restless that it is hard to sit still',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_6',
      text: 'Becoming easily annoyed or irritable',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_7',
      text: 'Feeling afraid, as if something awful might happen',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
  ],
};

// Simplified burnout inventory (5 questions, 0-4 scale)
export const BurnoutInventory: Assessment = {
  id: 'burnout',
  name: 'Burnout Inventory',
  description: 'Assess work-related exhaustion and burnout',
  questions: [
    {
      id: 'burnout_1',
      text: 'I feel emotionally drained from my work',
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' },
      ],
    },
    {
      id: 'burnout_2',
      text: 'I feel used up at the end of the workday',
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' },
      ],
    },
    {
      id: 'burnout_3',
      text: 'I feel tired when I get up in the morning and have to face another day',
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' },
      ],
    },
    {
      id: 'burnout_4',
      text: 'Working with people all day is a strain for me',
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' },
      ],
    },
    {
      id: 'burnout_5',
      text: 'I feel burned out from my work',
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' },
      ],
    },
  ],
};

// Big Five mini (5 questions, one per trait, 1-5 scale)
export const BigFiveMini: Assessment = {
  id: 'bigfive',
  name: 'Big Five Personality',
  description: 'Brief personality assessment',
  questions: [
    {
      id: 'bigfive_1',
      text: 'I see myself as extraverted, enthusiastic',
      options: [
        { value: 1, label: 'Disagree strongly' },
        { value: 2, label: 'Disagree a little' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree a little' },
        { value: 5, label: 'Agree strongly' },
      ],
    },
    {
      id: 'bigfive_2',
      text: 'I see myself as critical, quarrelsome',
      options: [
        { value: 1, label: 'Disagree strongly' },
        { value: 2, label: 'Disagree a little' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree a little' },
        { value: 5, label: 'Agree strongly' },
      ],
    },
    {
      id: 'bigfive_3',
      text: 'I see myself as dependable, self-disciplined',
      options: [
        { value: 1, label: 'Disagree strongly' },
        { value: 2, label: 'Disagree a little' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree a little' },
        { value: 5, label: 'Agree strongly' },
      ],
    },
    {
      id: 'bigfive_4',
      text: 'I see myself as anxious, easily upset',
      options: [
        { value: 1, label: 'Disagree strongly' },
        { value: 2, label: 'Disagree a little' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree a little' },
        { value: 5, label: 'Agree strongly' },
      ],
    },
    {
      id: 'bigfive_5',
      text: 'I see myself as open to new experiences, complex',
      options: [
        { value: 1, label: 'Disagree strongly' },
        { value: 2, label: 'Disagree a little' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree a little' },
        { value: 5, label: 'Agree strongly' },
      ],
    },
  ],
};

// Sleep quality (4 questions, 0-3 scale)
export const SleepQuality: Assessment = {
  id: 'sleep',
  name: 'Sleep Quality',
  description: 'Assess your sleep patterns',
  questions: [
    {
      id: 'sleep_1',
      text: 'How would you rate your sleep quality overall?',
      options: [
        { value: 0, label: 'Very poor' },
        { value: 1, label: 'Poor' },
        { value: 2, label: 'Good' },
        { value: 3, label: 'Very good' },
      ],
    },
    {
      id: 'sleep_2',
      text: 'How often do you have trouble falling asleep?',
      options: [
        { value: 3, label: 'Never' },
        { value: 2, label: 'Rarely' },
        { value: 1, label: 'Sometimes' },
        { value: 0, label: 'Often' },
      ],
    },
    {
      id: 'sleep_3',
      text: 'How often do you wake up during the night?',
      options: [
        { value: 3, label: 'Never' },
        { value: 2, label: 'Rarely' },
        { value: 1, label: 'Sometimes' },
        { value: 0, label: 'Often' },
      ],
    },
    {
      id: 'sleep_4',
      text: 'How rested do you feel when you wake up?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Somewhat' },
        { value: 2, label: 'Mostly' },
        { value: 3, label: 'Completely' },
      ],
    },
  ],
};

// Coping style (3 questions)
export const CopingStyle: Assessment = {
  id: 'coping',
  name: 'Coping Style',
  description: 'Identify your stress coping strategies',
  questions: [
    {
      id: 'coping_1',
      text: 'When stressed, I tend to:',
      options: [
        { value: 1, label: 'Avoid the problem' },
        { value: 2, label: 'Seek social support' },
        { value: 3, label: 'Problem-solve actively' },
        { value: 4, label: 'Use relaxation techniques' },
      ],
    },
    {
      id: 'coping_2',
      text: 'My primary way of dealing with difficult emotions is:',
      options: [
        { value: 1, label: 'Distraction' },
        { value: 2, label: 'Talking it out' },
        { value: 3, label: 'Analyzing the situation' },
        { value: 4, label: 'Physical activity' },
      ],
    },
    {
      id: 'coping_3',
      text: 'When facing a challenge, I usually:',
      options: [
        { value: 1, label: 'Hope it resolves itself' },
        { value: 2, label: 'Ask for help' },
        { value: 3, label: 'Make a plan' },
        { value: 4, label: 'Take a break first' },
      ],
    },
  ],
};

// Stress triggers (checklist)
export const StressTriggers: Assessment = {
  id: 'triggers',
  name: 'Stress Triggers',
  description: 'Identify your main stress sources',
  questions: [
    {
      id: 'triggers_1',
      text: 'Which areas cause you the most stress? (Select all that apply)',
      options: [
        { value: 1, label: 'Work/Career' },
        { value: 2, label: 'Relationships' },
        { value: 3, label: 'Finances' },
        { value: 4, label: 'Health' },
        { value: 5, label: 'Family' },
        { value: 6, label: 'Social situations' },
        { value: 7, label: 'Time pressure' },
        { value: 8, label: 'Uncertainty' },
      ],
    },
  ],
};

export const ALL_ASSESSMENTS = [
  PHQ9,
  GAD7,
  BurnoutInventory,
  BigFiveMini,
  SleepQuality,
  CopingStyle,
  StressTriggers,
];
