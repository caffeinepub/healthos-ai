export interface Hotline {
  name: string;
  number: string;
  description: string;
}

export const CRISIS_HOTLINES: Record<string, Hotline[]> = {
  US: [
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      description: '24/7 crisis support and suicide prevention',
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 text support',
    },
    {
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Mental health and substance abuse support',
    },
  ],
  UK: [
    {
      name: 'Samaritans',
      number: '116 123',
      description: '24/7 emotional support',
    },
    {
      name: 'Crisis Text Line UK',
      number: 'Text SHOUT to 85258',
      description: 'Free 24/7 text support',
    },
  ],
  CA: [
    {
      name: 'Canada Suicide Prevention Service',
      number: '1-833-456-4566',
      description: '24/7 crisis support',
    },
    {
      name: 'Crisis Text Line Canada',
      number: 'Text TALK to 686868',
      description: 'Free 24/7 text support',
    },
  ],
  AU: [
    {
      name: 'Lifeline Australia',
      number: '13 11 14',
      description: '24/7 crisis support',
    },
    {
      name: 'Beyond Blue',
      number: '1300 22 4636',
      description: 'Mental health support',
    },
  ],
};

export const COUNTRIES = Object.keys(CRISIS_HOTLINES);
