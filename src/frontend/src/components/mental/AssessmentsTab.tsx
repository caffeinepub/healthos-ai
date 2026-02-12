import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ALL_ASSESSMENTS, Assessment } from './assessments/assessmentDefinitions';
import { computeAssessmentResult, AssessmentAnswers } from './assessments/scoring';
import { useGetAssessment, useSaveAssessment } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function AssessmentsTab() {
  const { data: existingAssessment } = useGetAssessment();
  const saveAssessment = useSaveAssessment();
  
  const [currentAssessmentIndex, setCurrentAssessmentIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [showResults, setShowResults] = useState(false);

  const currentAssessment = ALL_ASSESSMENTS[currentAssessmentIndex];
  const currentQuestion = currentAssessment.questions[currentQuestionIndex];
  const totalAssessments = ALL_ASSESSMENTS.length;
  const totalQuestions = currentAssessment.questions.length;
  const overallProgress = ((currentAssessmentIndex * 100 + (currentQuestionIndex / totalQuestions) * 100) / totalAssessments);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem('assessmentDraft');
    if (draft && !existingAssessment) {
      try {
        const parsed = JSON.parse(draft);
        setAnswers(parsed.answers || {});
        setCurrentAssessmentIndex(parsed.assessmentIndex || 0);
        setCurrentQuestionIndex(parsed.questionIndex || 0);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [existingAssessment]);

  // Save draft to localStorage
  useEffect(() => {
    if (!showResults && !existingAssessment) {
      localStorage.setItem('assessmentDraft', JSON.stringify({
        answers,
        assessmentIndex: currentAssessmentIndex,
        questionIndex: currentQuestionIndex,
      }));
    }
  }, [answers, currentAssessmentIndex, currentQuestionIndex, showResults, existingAssessment]);

  const handleAnswer = (value: number | number[]) => {
    setAnswers({
      ...answers,
      [currentAssessment.id]: {
        ...(answers[currentAssessment.id] || {}),
        [currentQuestion.id]: value,
      },
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentAssessmentIndex < totalAssessments - 1) {
      setCurrentAssessmentIndex(currentAssessmentIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentAssessmentIndex > 0) {
      setCurrentAssessmentIndex(currentAssessmentIndex - 1);
      setCurrentQuestionIndex(ALL_ASSESSMENTS[currentAssessmentIndex - 1].questions.length - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const result = computeAssessmentResult(answers);
      await saveAssessment.mutateAsync(result);
      localStorage.removeItem('assessmentDraft');
      setShowResults(true);
      toast.success('Assessment completed successfully!');
    } catch (error) {
      toast.error('Failed to save assessment');
      console.error(error);
    }
  };

  const currentAnswer = answers[currentAssessment.id]?.[currentQuestion.id];
  const canProceed = currentAnswer !== undefined;

  if (existingAssessment || showResults) {
    const result = existingAssessment || computeAssessmentResult(answers);
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
          <h2 className="text-3xl font-bold text-foreground">Assessment Complete</h2>
          <p className="mt-2 text-muted-foreground">
            Here are your results. Remember, this is for informational purposes only.
          </p>
        </div>

        <Card className="border-amber-200 dark:border-amber-900/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle>Disclaimer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              These results are not a diagnosis. If you are concerned about your mental health,
              please consult a qualified mental health professional.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Baseline Score</CardTitle>
              <CardDescription>Overall mental wellness indicator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {result.baselineScore.toFixed(0)}/100
              </div>
              <Progress value={result.baselineScore} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Burnout Risk Score</CardTitle>
              <CardDescription>Work-related exhaustion level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {(result.burnoutScore * 100).toFixed(0)}%
              </div>
              <Progress value={result.burnoutScore * 100} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personality Adaptation Profile</CardTitle>
              <CardDescription>Big Five personality traits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{result.personalityProfile}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stress Reactivity Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{result.stressReactivityType}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coping Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{result.copingStyle}</div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Main Stress Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.stressTriggers.map((trigger, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {!existingAssessment && (
          <div className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retake Assessment
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Mental Health Assessment</h2>
        <p className="mt-2 text-muted-foreground">
          Complete this comprehensive assessment to establish your baseline
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{currentAssessment.name}</CardTitle>
              <CardDescription>{currentAssessment.description}</CardDescription>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>Assessment {currentAssessmentIndex + 1} of {totalAssessments}</div>
              <div>Question {currentQuestionIndex + 1} of {totalQuestions}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={overallProgress} />

          <div className="space-y-4">
            <Label className="text-base font-medium">{currentQuestion.text}</Label>
            
            {currentQuestion.id === 'triggers_1' ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${option.value}`}
                      checked={(currentAnswer as number[] || []).includes(option.value)}
                      onCheckedChange={(checked) => {
                        const current = (currentAnswer as number[] || []);
                        if (checked) {
                          handleAnswer([...current, option.value]);
                        } else {
                          handleAnswer(current.filter((v) => v !== option.value));
                        }
                      }}
                    />
                    <Label htmlFor={`option-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={currentAnswer?.toString()}
                onValueChange={(value) => handleAnswer(Number(value))}
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentAssessmentIndex === 0 && currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed || saveAssessment.isPending}>
              {currentAssessmentIndex === totalAssessments - 1 &&
              currentQuestionIndex === totalQuestions - 1
                ? saveAssessment.isPending
                  ? 'Saving...'
                  : 'Complete'
                : 'Next'}
              {!(currentAssessmentIndex === totalAssessments - 1 &&
                currentQuestionIndex === totalQuestions - 1) && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
