import { ExtendedMentalHealthProfile, Profession, LifeGoal } from '../backend';

// Validation errors - now a proper Record type
export type PersonalizationValidationErrors = Record<string, string>;

// Gender mapping (backend uses Int: 0=male, 1=female, 2=nonBinary, 3=other, 4=preferNotToSay)
export const GENDER_VALUES = {
  male: 0,
  female: 1,
  nonBinary: 2,
  other: 3,
  preferNotToSay: 4,
} as const;

// Validate personalization fields with context-specific rules
export function validatePersonalizationFields(
  age: string,
  gender: string,
  profession: string,
  professionOther: string,
  futureGoals: LifeGoal[],
  context: 'setup' | 'edit' = 'setup'
): PersonalizationValidationErrors {
  const errors: PersonalizationValidationErrors = {};

  // Validate age - required for setup, optional for edit
  if (age.trim()) {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) {
      errors.age = 'Age must be a valid number';
    } else if (ageNum < 13 || ageNum > 120) {
      errors.age = 'Age must be between 13 and 120';
    } else if (!Number.isInteger(ageNum)) {
      errors.age = 'Age must be a whole number';
    }
  } else if (context === 'setup') {
    errors.age = 'Age is required';
  }

  // Validate gender
  if (!gender) {
    errors.gender = 'Gender is required';
  }

  // Validate profession
  if (!profession) {
    errors.profession = 'Profession is required';
  } else if (profession === 'other' && !professionOther.trim()) {
    errors.profession = 'Please specify your profession';
  }

  // Validate future goals
  if (futureGoals.length === 0) {
    errors.futureGoals = 'At least one future goal is required';
  }

  return errors;
}

// Safe age parsing - returns bigint only if valid, otherwise undefined
export function parseAge(ageString: string): bigint | undefined {
  const trimmed = ageString.trim();
  if (!trimmed) return undefined;
  
  const ageNum = parseInt(trimmed, 10);
  if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
    return undefined;
  }
  
  return BigInt(ageNum);
}

// Check if personalization is complete
export function isPersonalizationComplete(profile: ExtendedMentalHealthProfile | null): boolean {
  if (!profile) return false;
  
  return !!(
    profile.age !== undefined &&
    profile.age !== null &&
    profile.gender !== undefined &&
    profile.profession &&
    profile.futureGoals &&
    profile.futureGoals.length > 0
  );
}

// Convert form value to backend gender (Int)
export function formValueToGender(value: string): bigint {
  switch (value) {
    case 'male':
      return BigInt(GENDER_VALUES.male);
    case 'female':
      return BigInt(GENDER_VALUES.female);
    case 'nonBinary':
      return BigInt(GENDER_VALUES.nonBinary);
    case 'other':
      return BigInt(GENDER_VALUES.other);
    case 'preferNotToSay':
      return BigInt(GENDER_VALUES.preferNotToSay);
    default:
      return BigInt(GENDER_VALUES.preferNotToSay);
  }
}

// Convert backend gender (Int) to form value
export function genderToFormValue(gender: bigint): string {
  const genderNum = Number(gender);
  switch (genderNum) {
    case GENDER_VALUES.male:
      return 'male';
    case GENDER_VALUES.female:
      return 'female';
    case GENDER_VALUES.nonBinary:
      return 'nonBinary';
    case GENDER_VALUES.other:
      return 'other';
    case GENDER_VALUES.preferNotToSay:
      return 'preferNotToSay';
    default:
      return 'preferNotToSay';
  }
}

// Convert form values to backend Profession type
export function formValueToProfession(value: string, otherText: string = ''): Profession {
  switch (value) {
    case 'student':
      return { __kind__: 'student', student: null };
    case 'softwareEngineer':
      return { __kind__: 'softwareEngineer', softwareEngineer: null };
    case 'doctor':
      return { __kind__: 'doctor', doctor: null };
    case 'nurse':
      return { __kind__: 'nurse', nurse: null };
    case 'teacher':
      return { __kind__: 'teacher', teacher: null };
    case 'artist':
      return { __kind__: 'artist', artist: null };
    case 'musician':
      return { __kind__: 'musician', musician: null };
    case 'designer':
      return { __kind__: 'designer', designer: null };
    case 'scientist':
      return { __kind__: 'scientist', scientist: null };
    case 'other':
      return { __kind__: 'other', other: otherText };
    default:
      return { __kind__: 'other', other: 'unspecified' };
  }
}

// Convert backend Profession to form value
export function professionToFormValue(profession: Profession): { value: string; otherText: string } {
  if (profession.__kind__ === 'student') return { value: 'student', otherText: '' };
  if (profession.__kind__ === 'softwareEngineer') return { value: 'softwareEngineer', otherText: '' };
  if (profession.__kind__ === 'doctor') return { value: 'doctor', otherText: '' };
  if (profession.__kind__ === 'nurse') return { value: 'nurse', otherText: '' };
  if (profession.__kind__ === 'teacher') return { value: 'teacher', otherText: '' };
  if (profession.__kind__ === 'artist') return { value: 'artist', otherText: '' };
  if (profession.__kind__ === 'musician') return { value: 'musician', otherText: '' };
  if (profession.__kind__ === 'designer') return { value: 'designer', otherText: '' };
  if (profession.__kind__ === 'scientist') return { value: 'scientist', otherText: '' };
  if (profession.__kind__ === 'other') return { value: 'other', otherText: profession.other };
  return { value: 'other', otherText: 'unspecified' };
}

// Get human-readable gender label
export function getGenderLabel(gender: bigint): string {
  const genderNum = Number(gender);
  switch (genderNum) {
    case GENDER_VALUES.male:
      return 'Male';
    case GENDER_VALUES.female:
      return 'Female';
    case GENDER_VALUES.nonBinary:
      return 'Non-binary';
    case GENDER_VALUES.other:
      return 'Other';
    case GENDER_VALUES.preferNotToSay:
      return 'Prefer not to say';
    default:
      return 'Not specified';
  }
}

// Get human-readable profession label
export function getProfessionLabel(profession: Profession): string {
  if (profession.__kind__ === 'student') return 'Student';
  if (profession.__kind__ === 'softwareEngineer') return 'Software Engineer';
  if (profession.__kind__ === 'doctor') return 'Doctor';
  if (profession.__kind__ === 'nurse') return 'Nurse';
  if (profession.__kind__ === 'teacher') return 'Teacher';
  if (profession.__kind__ === 'artist') return 'Artist';
  if (profession.__kind__ === 'musician') return 'Musician';
  if (profession.__kind__ === 'designer') return 'Designer';
  if (profession.__kind__ === 'scientist') return 'Scientist';
  if (profession.__kind__ === 'other') return profession.other || 'Other';
  return 'Not specified';
}

// Get brief context string for guidance personalization
export function getPersonalizationContext(profile: ExtendedMentalHealthProfile | null): {
  age?: number;
  profession: string;
  goalsSummary: string;
} {
  if (!profile || !isPersonalizationComplete(profile)) {
    return {
      profession: 'general',
      goalsSummary: '',
    };
  }

  const age = profile.age ? Number(profile.age) : undefined;
  const profession = getProfessionLabel(profile.profession).toLowerCase();
  const goalsSummary = profile.futureGoals
    .map((g) => g.description)
    .slice(0, 3)
    .join(', ');

  return {
    age,
    profession,
    goalsSummary,
  };
}
