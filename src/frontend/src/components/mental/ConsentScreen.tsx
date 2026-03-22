import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, AlertTriangle, Database, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../../hooks/useQueries";

interface ConsentScreenProps {
  onOpenProfileSetup?: () => void;
}

export default function ConsentScreen({
  onOpenProfileSetup,
}: ConsentScreenProps) {
  const { data: profile, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [accepted, setAccepted] = useState(false);

  if (isFetched && !profile) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
          <p className="text-muted-foreground mb-6">
            Please complete your profile setup first to access mental health
            features.
          </p>
          <Button
            onClick={() => onOpenProfileSetup?.()}
            data-ocid="consent.setup_button"
          >
            Set Up Profile
          </Button>
        </div>
      </div>
    );
  }

  const handleAccept = async () => {
    if (!profile) return;

    try {
      await saveProfile.mutateAsync({
        ...profile,
        consentGiven: true,
      });
      toast.success(
        "Consent accepted. You can now access mental health features.",
      );
    } catch (error) {
      toast.error("Failed to save consent");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Consent & Data Transparency
        </h2>
        <p className="mt-2 text-muted-foreground">
          Please review and accept the following before using mental health
          features
        </p>
      </div>

      <Card className="border-amber-200 dark:border-amber-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle>Important Disclaimer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>This is NOT therapy or medical advice.</strong> This
            application provides self-help tools and educational content for
            mental performance and preventive mental health. It is not a
            substitute for professional mental health care.
          </p>
          <p>
            If you are experiencing a mental health crisis or emergency, please
            contact emergency services or a crisis hotline immediately.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Data Storage & Privacy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>On-chain storage:</strong> Your assessment results, daily
            logs, and derived metrics are stored on the Internet Computer
            blockchain. This ensures data persistence and security.
          </p>
          <p>
            <strong>Local analysis:</strong> Journal analysis (cognitive
            distortion detection, prompts) is performed locally in your browser
            using deterministic rules. No external AI services are used.
          </p>
          <p>
            <strong>Anonymous mode:</strong> You can enable anonymous mode in
            Settings to prevent raw journal text from being stored on-chain.
            Only derived metrics will be saved.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Crisis & Emergency Guidance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            This app includes a Crisis Safety System with risk screening,
            hotlines, and safety planning tools. However, it cannot replace
            professional crisis intervention.
          </p>
          <p>
            <strong>If you are in immediate danger:</strong> Call emergency
            services (911 in the US) or go to your nearest emergency room.
          </p>
          <p>
            <strong>Crisis hotlines:</strong> The app provides a list of crisis
            hotlines by country. These are informational only; the app cannot
            make calls or send messages on your behalf.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <Label
              htmlFor="consent"
              className="cursor-pointer text-sm leading-relaxed"
            >
              I have read and understood the disclaimers above. I acknowledge
              that this is not therapy or medical advice, and I understand how
              my data is stored and analyzed. I accept these terms and wish to
              proceed.
            </Label>
          </div>
          <Button
            onClick={handleAccept}
            disabled={!accepted || saveProfile.isPending}
            className="mt-6 w-full"
            size="lg"
          >
            {saveProfile.isPending ? "Saving..." : "Accept and Continue"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            You can review or revoke consent at any time in Settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
