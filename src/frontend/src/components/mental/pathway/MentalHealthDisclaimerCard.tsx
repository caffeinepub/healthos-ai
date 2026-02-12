import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MentalHealthDisclaimerCard() {
  return (
    <Card className="border-amber-200 dark:border-amber-900/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-base">Important Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Alert>
          <AlertDescription>
            <strong>This is not therapy:</strong> These are self-guided educational tools based on evidence-based therapeutic frameworks. They are not a substitute for professional mental health care, diagnosis, or treatment.
          </AlertDescription>
        </Alert>
        <p>
          <strong>Self-help only:</strong> All modules are designed for self-exploration and skill-building. If you need clinical support, please consult a licensed mental health professional.
        </p>
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 text-red-600" />
            <div className="text-xs">
              <p className="font-semibold text-red-900 dark:text-red-200">Crisis Support:</p>
              <p className="text-red-800 dark:text-red-300">
                If you're in crisis, call 988 (Suicide & Crisis Lifeline) or visit your local emergency department.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
