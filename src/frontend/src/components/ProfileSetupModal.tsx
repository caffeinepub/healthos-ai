import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ExtendedMentalHealthProfile, LifeGoal } from "../backend";
import { useActor } from "../hooks/useActor";
import { useSaveCallerUserProfile } from "../hooks/useQueries";
import { useTimeZone } from "../hooks/useTimeZone";
import {
  formValueToGender,
  formValueToProfession,
  parseAge,
  validatePersonalizationFields,
} from "../utils/personalization";

interface ProfileSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileSetupModal({
  open,
  onClose,
}: ProfileSetupModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [professionOther, setProfessionOther] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [goalYear, setGoalYear] = useState("");
  const [futureGoals, setFutureGoals] = useState<LifeGoal[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { actor, isFetching: actorFetching } = useActor();
  const saveProfile = useSaveCallerUserProfile();
  const { detectedTimeZone } = useTimeZone();

  const isActorReady = !!actor && !actorFetching;

  const handleAddGoal = () => {
    if (!goalInput.trim()) {
      toast.error("Please enter a goal description");
      return;
    }
    if (!goalYear) {
      toast.error("Please enter a target year");
      return;
    }
    const yearNum = Number.parseInt(goalYear, 10);
    const currentYear = new Date().getFullYear();
    if (
      Number.isNaN(yearNum) ||
      yearNum < currentYear ||
      yearNum > currentYear + 50
    ) {
      toast.error(
        `Target year must be between ${currentYear} and ${currentYear + 50}`,
      );
      return;
    }

    const newGoal: LifeGoal = {
      description: goalInput.trim(),
      targetYear: BigInt(yearNum),
    };
    setFutureGoals([...futureGoals, newGoal]);
    setGoalInput("");
    setGoalYear("");
  };

  const handleRemoveGoal = (index: number) => {
    setFutureGoals(futureGoals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isActorReady) {
      toast.error(
        "Still connecting to the network, please wait a moment and try again.",
      );
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) {
      newErrors.displayName = "Name is required";
    }

    const validationErrors = validatePersonalizationFields(
      age,
      gender,
      profession,
      professionOther,
      futureGoals,
      "setup",
    );

    // Future goals are optional — exclude from required error checks
    const { futureGoals: _fg, ...requiredValidationErrors } = validationErrors;
    const allErrors = { ...newErrors, ...requiredValidationErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstError = Object.values(allErrors)[0];
      toast.error(firstError || "Please fix the errors before continuing");
      return;
    }

    setErrors({});

    const parsedAge = parseAge(age);
    if (!parsedAge) {
      setErrors({ age: "Please enter a valid age" });
      toast.error("Please enter a valid age between 13 and 120");
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
      toast.success("Profile created successfully! Welcome to HealthOS AI.");
      onClose();
    } catch (error) {
      console.error("Profile save error:", error);
      const msg =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to create profile: ${msg}`);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Welcome to Mental Performance</DialogTitle>
              <DialogDescription>
                Let&apos;s set up your profile to personalize your experience
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full"
              onClick={onClose}
              data-ocid="profile.close_button"
              aria-label="Close profile setup"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {actorFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Connecting to network...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Your Name *</Label>
            <Input
              id="displayName"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (errors.displayName)
                  setErrors((prev) => ({ ...prev, displayName: "" }));
              }}
              autoFocus
              data-ocid="profile.input"
            />
            {errors.displayName && (
              <p
                className="text-sm text-destructive"
                data-ocid="profile.error_state"
              >
                {errors.displayName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (errors.age) setErrors((prev) => ({ ...prev, age: "" }));
              }}
              min="13"
              max="120"
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={gender}
              onValueChange={(v) => {
                setGender(v);
                if (errors.gender)
                  setErrors((prev) => ({ ...prev, gender: "" }));
              }}
            >
              <SelectTrigger id="gender" data-ocid="profile.select">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="nonBinary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="preferNotToSay">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <Select
              value={profession}
              onValueChange={(v) => {
                setProfession(v);
                if (errors.profession)
                  setErrors((prev) => ({ ...prev, profession: "" }));
              }}
            >
              <SelectTrigger id="profession">
                <SelectValue placeholder="Select your profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="softwareEngineer">
                  Software Engineer
                </SelectItem>
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
            {profession === "other" && (
              <Input
                placeholder="Please specify your profession"
                value={professionOther}
                onChange={(e) => setProfessionOther(e.target.value)}
                className="mt-2"
              />
            )}
            {errors.profession && (
              <p className="text-sm text-destructive">{errors.profession}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Future Goals{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
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
                <Button
                  type="button"
                  onClick={handleAddGoal}
                  variant="outline"
                  data-ocid="profile.secondary_button"
                >
                  Add
                </Button>
              </div>
              {futureGoals.length > 0 && (
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {futureGoals.map((goal, index) => (
                    <div
                      key={`goal-${goal.description}-${index}`}
                      className="flex items-center justify-between gap-2 text-sm"
                      data-ocid={`profile.item.${index + 1}`}
                    >
                      <span className="flex-1">
                        {goal.description} (by {goal.targetYear.toString()})
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGoal(index)}
                        data-ocid={`profile.delete_button.${index + 1}`}
                        aria-label="Remove goal"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <p>Detected timezone: {detectedTimeZone}</p>
            <p className="mt-1 text-xs">
              You can change this later in Settings
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending || actorFetching || !isActorReady}
            data-ocid="profile.submit_button"
          >
            {actorFetching
              ? "Connecting..."
              : saveProfile.isPending
                ? "Creating Profile..."
                : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
