import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useRevokeConsent, useToggleAnonymousMode } from '../hooks/useQueries';
import { toast } from 'sonner';
import { User, Shield, Database, Clock, Briefcase, Target } from 'lucide-react';
import { ExtendedMentalHealthProfile, LifeGoal } from '../backend';
import {
  validatePersonalizationFields,
  formValueToGender,
  formValueToProfession,
  genderToFormValue,
  professionToFormValue,
  getGenderLabel,
  getProfessionLabel,
  parseAge,
} from '../utils/personalization';
import { X } from 'lucide-react';

export default function ProfileTab() {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const revokeConsent = useRevokeConsent();
  const toggleAnonymous = useToggleAnonymousMode();
  const [isEditing, setIsEditing] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profession, setProfession] = useState('');
  const [professionOther, setProfessionOther] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [goalYear, setGoalYear] = useState('');
  const [futureGoals, setFutureGoals] = useState<LifeGoal[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName);
      setAge(userProfile.age ? userProfile.age.toString() : '');
      setGender(genderToFormValue(userProfile.gender));
      const profData = professionToFormValue(userProfile.profession);
      setProfession(profData.value);
      setProfessionOther(profData.otherText);
      setTimeZone(userProfile.timeZone);
      setFutureGoals(userProfile.futureGoals);
    }
  }, [userProfile]);

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

  const handleSave = async () => {
    if (!userProfile) return;

    // Validate display name
    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) {
      newErrors.displayName = 'Name is required';
    }

    // Validate personalization fields (edit context - age is optional)
    const validationErrors = validatePersonalizationFields(
      age,
      gender,
      profession,
      professionOther,
      futureGoals,
      'edit'
    );

    // Merge errors
    const allErrors = { ...newErrors, ...validationErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Please fix the errors before saving');
      return;
    }

    // Parse age safely - allow blank for edit
    const parsedAge = parseAge(age);
    if (age.trim() && !parsedAge) {
      setErrors({ age: 'Please enter a valid age between 13 and 120' });
      toast.error('Please enter a valid age');
      return;
    }

    try {
      const updatedProfile: ExtendedMentalHealthProfile = {
        ...userProfile,
        displayName: displayName.trim(),
        age: parsedAge,
        gender: formValueToGender(gender),
        profession: formValueToProfession(profession, professionOther),
        timeZone,
        futureGoals,
      };
      await saveProfile.mutateAsync(updatedProfile);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setDisplayName(userProfile.displayName);
      setAge(userProfile.age ? userProfile.age.toString() : '');
      setGender(genderToFormValue(userProfile.gender));
      const profData = professionToFormValue(userProfile.profession);
      setProfession(profData.value);
      setProfessionOther(profData.otherText);
      setTimeZone(userProfile.timeZone);
      setFutureGoals(userProfile.futureGoals);
      setErrors({});
    }
    setIsEditing(false);
  };

  const handleToggleAnonymous = async () => {
    if (!userProfile) return;
    try {
      await toggleAnonymous.mutateAsync(!userProfile.anonymousMode);
      toast.success(
        userProfile.anonymousMode
          ? 'Anonymous mode disabled'
          : 'Anonymous mode enabled - journal content will not be saved'
      );
    } catch (error) {
      toast.error('Failed to toggle anonymous mode');
      console.error(error);
    }
  };

  const handleRevokeConsent = async () => {
    if (!userProfile) return;
    if (!confirm('Are you sure you want to revoke consent? This will prevent saving new data.')) {
      return;
    }
    try {
      await revokeConsent.mutateAsync();
      toast.success('Consent revoked');
    } catch (error) {
      toast.error('Failed to revoke consent');
      console.error(error);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            {isEditing ? (
              <>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                />
                {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
              </>
            ) : (
              <p className="text-sm">{userProfile.displayName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            {isEditing ? (
              <>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age (optional)"
                  min="13"
                  max="120"
                />
                {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
              </>
            ) : (
              <p className="text-sm">{userProfile.age ? userProfile.age.toString() : 'Not specified'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            {isEditing ? (
              <>
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
              </>
            ) : (
              <p className="text-sm">{getGenderLabel(userProfile.gender)}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            {isEditing ? (
              <>
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
              </>
            ) : (
              <p className="text-sm">{getProfessionLabel(userProfile.profession)}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeZone">Time Zone</Label>
            {isEditing ? (
              <Input
                id="timeZone"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                placeholder="e.g., America/New_York"
              />
            ) : (
              <p className="text-sm">{userProfile.timeZone}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Future Goals
          </CardTitle>
          <CardDescription>Your aspirations and targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && (
            <div className="space-y-2">
              <Label>Add New Goal</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Goal description"
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
              {errors.futureGoals && <p className="text-sm text-destructive">{errors.futureGoals}</p>}
            </div>
          )}

          {futureGoals.length > 0 ? (
            <div className="space-y-2">
              {futureGoals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium">{goal.description}</p>
                    <p className="text-sm text-muted-foreground">Target: {goal.targetYear.toString()}</p>
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No goals added yet</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Consent
          </CardTitle>
          <CardDescription>Manage your data privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Anonymous Mode</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, journal content will not be saved
              </p>
            </div>
            <Switch
              checked={userProfile.anonymousMode}
              onCheckedChange={handleToggleAnonymous}
              disabled={toggleAnonymous.isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Consent</Label>
              <p className="text-sm text-muted-foreground">
                {userProfile.consentGiven
                  ? 'You have given consent to save your data'
                  : 'Consent required to save data'}
              </p>
            </div>
            {userProfile.consentGiven && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRevokeConsent}
                disabled={revokeConsent.isPending}
              >
                Revoke Consent
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}
