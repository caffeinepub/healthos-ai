import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useTimeZone } from '../hooks/useTimeZone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ExtendedMentalHealthProfile, LifeGoal } from '../backend';
import {
  validatePersonalizationFields,
  formValueToGender,
  formValueToProfession,
  parseAge,
} from '../utils/personalization';
import { X } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileSetupModal({ open, onClose }: ProfileSetupModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profession, setProfession] = useState('');
  const [professionOther, setProfessionOther] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [goalYear, setGoalYear] = useState('');
  const [futureGoals, setFutureGoals] = useState<LifeGoal[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const saveProfile = useSaveCallerUserProfile();
  const { detectedTimeZone } = useTimeZone();

  const handleAddGoal = () => {
    if (!goalInput.trim()) {
      toast.error('Please enter a goal description');
      return;
    }
    if (!goalYear) {
      toast.error('Please enter a target year');
      return;
    }
    const yearNum = parseInt(goalYear, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < currentYear || yearNum > currentYear + 50) {
      toast.error(`Target year must be between ${currentYear} and ${currentYear + 50}`);
      return;
    }

    const newGoal: LifeGoal = {
      description: goalInput.trim(),
      targetYear: BigInt(yearNum),
    };
    setFutureGoals([...futureGoals, newGoal]);
    setGoalInput('');
    setGoalYear('');
  };

  const handleRemoveGoal = (index: number) => {
    setFutureGoals(futureGoals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate display name first
    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) {
      newErrors.displayName = 'Name is required';
    }

    // Validate personalization fields
    const validationErrors = validatePersonalizationFields(
      age,
      gender,
      profession,
      professionOther,
      futureGoals,
      'setup'
    );

    // Merge errors
    const allErrors = { ...newErrors, ...validationErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Please fix the errors before continuing');
      return;
    }

    // Parse age safely
    const parsedAge = parseAge(age);
    if (!parsedAge) {
      setErrors({ age: 'Please enter a valid age' });
      toast.error('Please enter a valid age');
      return;
    }

    try {
      const profile: ExtendedMentalHealthProfile = {
        displayName: displayName.trim(),
        timeZone: detectedTimeZone,
        consentGiven: false,
        anonymousMode: false,
        age: parsedAge,
        gender: formValueToGender(gender),
        profession: formValueToProfession(profession, professionOther),
        futureGoals,
      };
      await saveProfile.mutateAsync(profile);
      toast.success('Profile created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Mental Performance</DialogTitle>
          <DialogDescription>Let's set up your profile to personalize your experience</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Your Name *</Label>
            <Input
              id="displayName"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoFocus
            />
            {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="13"
              max="120"
            />
            {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="nonBinary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="preferNotToSay">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <Select value={profession} onValueChange={setProfession}>
              <SelectTrigger id="profession">
                <SelectValue placeholder="Select your profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="softwareEngineer">Software Engineer</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="musician">Musician</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="scientist">Scientist</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {profession === 'other' && (
              <Input
                placeholder="Please specify your profession"
                value={professionOther}
                onChange={(e) => setProfessionOther(e.target.value)}
                className="mt-2"
              />
            )}
            {errors.profession && <p className="text-sm text-destructive">{errors.profession}</p>}
          </div>

          <div className="space-y-2">
            <Label>Future Goals * (at least one required)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Goal description (e.g., Complete a marathon)"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Year"
                  value={goalYear}
                  onChange={(e) => setGoalYear(e.target.value)}
                  className="w-24"
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 50}
                />
                <Button type="button" onClick={handleAddGoal} variant="outline">
                  Add
                </Button>
              </div>
              {futureGoals.length > 0 && (
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {futureGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex-1">
                        {goal.description} (by {goal.targetYear.toString()})
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGoal(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.futureGoals && <p className="text-sm text-destructive">{errors.futureGoals}</p>}
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <p>Detected timezone: {detectedTimeZone}</p>
            <p className="mt-1 text-xs">You can change this later in Settings</p>
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
