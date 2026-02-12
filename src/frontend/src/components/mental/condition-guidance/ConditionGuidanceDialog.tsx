import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, AlertTriangle, BookOpen, Activity, Apple, AlertCircle, Phone, ArrowRight, Shield, Settings } from 'lucide-react';
import { CONDITIONS, matchCondition, getConditionsByCategory, getCategoryDisplayName, Condition } from './conditions';
import { assessRisk, needsImmediateCrisis } from './riskTriggers';
import { generateGuidance, GuidanceOutput } from './guidanceGenerator';
import { CRISIS_HOTLINES } from '../crisis/hotlinesDataset';
import { useGetCallerUserProfile } from '../../../hooks/useQueries';
import { isPersonalizationComplete } from '../../../utils/personalization';

interface ConditionGuidanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenModule?: (moduleId: string) => void;
  onNavigateToSettings?: () => void;
}

export default function ConditionGuidanceDialog({ open, onOpenChange, onOpenModule, onNavigateToSettings }: ConditionGuidanceDialogProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const [searchInput, setSearchInput] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [guidance, setGuidance] = useState<GuidanceOutput | null>(null);
  const [showList, setShowList] = useState(false);
  
  const handleSearch = () => {
    const result = matchCondition(searchInput);
    
    if (result.confidence === 'high' && result.condition) {
      handleSelectCondition(result.condition);
    } else {
      // Low confidence - show list
      setShowList(true);
    }
  };
  
  const handleSelectCondition = (condition: Condition) => {
    setSelectedCondition(condition);
    const generatedGuidance = generateGuidance(condition, userProfile);
    setGuidance(generatedGuidance);
    setShowList(false);
  };
  
  const handleReset = () => {
    setSearchInput('');
    setSelectedCondition(null);
    setGuidance(null);
    setShowList(false);
  };
  
  const handleOpenModule = (moduleId: string) => {
    if (onOpenModule) {
      onOpenModule(moduleId);
      onOpenChange(false);
    }
  };

  const handleGoToSettings = () => {
    if (onNavigateToSettings) {
      onNavigateToSettings();
      onOpenChange(false);
    }
  };
  
  // Check consent
  if (!userProfile?.consentGiven) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <DialogTitle>Consent Required</DialogTitle>
            </div>
          </DialogHeader>
          <Alert>
            <AlertDescription>
              Please visit the Settings tab to review and accept the consent terms before accessing condition guidance.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  // Check personalization completeness
  const personalizationComplete = isPersonalizationComplete(userProfile);
  
  // Check for high risk
  const riskAssessment = assessRisk(selectedCondition, searchInput);
  const showCrisisResources = needsImmediateCrisis(searchInput) || riskAssessment.isHighRisk;
  
  const conditionsByCategory = getConditionsByCategory();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Condition-Based Guidance
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          {!personalizationComplete && (
            <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <Settings className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-2">Complete your profile for personalized guidance</p>
                <p className="text-sm mb-3">
                  Add your age, gender, profession, and future goals to receive guidance tailored to your situation.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGoToSettings}
                  className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  Go to Settings
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!selectedCondition && !showList && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This tool provides educational guidance only. It does not diagnose conditions or replace professional care.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Label htmlFor="condition-search">Search or select a mental health condition</Label>
                <div className="flex gap-2">
                  <Input
                    id="condition-search"
                    placeholder="e.g., anxiety, depression, PTSD..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <Button variant="outline" onClick={() => setShowList(true)}>
                  Browse All Conditions
                </Button>
              </div>
            </div>
          )}
          
          {showList && !selectedCondition && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select a Condition</h3>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Back to Search
                </Button>
              </div>
              
              {Object.entries(conditionsByCategory).map(([category, conditions]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">{getCategoryDisplayName(category)}</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {conditions.map((condition) => (
                      <button
                        key={condition.id}
                        onClick={() => handleSelectCondition(condition)}
                        className="rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm">{condition.name}</p>
                          {condition.riskLevel === 'high-risk' && (
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedCondition && guidance && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedCondition.name}</h3>
                  {selectedCondition.riskLevel === 'high-risk' && (
                    <Badge variant="outline" className="mt-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Requires Professional Care
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Change Condition
                </Button>
              </div>
              
              {showCrisisResources && (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900 dark:text-red-100">
                    <p className="font-semibold mb-2">{riskAssessment.message}</p>
                    <div className="space-y-2 mt-3">
                      <p className="font-semibold">Crisis Resources:</p>
                      {CRISIS_HOTLINES.US.slice(0, 2).map((hotline) => (
                        <div key={hotline.number} className="flex items-start gap-2">
                          <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">{hotline.name}: {hotline.number}</p>
                            <p className="text-sm">{hotline.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Understanding This Condition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{guidance.conditionSummary}</p>
                </CardContent>
              </Card>
              
              {!showCrisisResources && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Evidence-Based Therapy Approaches</h4>
                    </div>
                    {guidance.therapyApproaches.map((approach, idx) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="text-base">{approach.name}</CardTitle>
                          <CardDescription>{approach.whyEffective}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Core Techniques:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {approach.coreTechniques.map((technique, i) => (
                                <li key={i}>• {technique}</li>
                              ))}
                            </ul>
                          </div>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium mb-2">How to Start in App:</p>
                            <div className="space-y-2">
                              {approach.howToStartInApp.map((action, i) => (
                                <div key={i} className="flex items-center justify-between gap-2">
                                  <p className="text-sm text-muted-foreground">{action.description}</p>
                                  {action.moduleId && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleOpenModule(action.moduleId!)}
                                    >
                                      Start
                                      <ArrowRight className="h-3 w-3 ml-1" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Daily Regulation Practices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        {guidance.dailyPractices.map((practice, i) => (
                          <li key={i}>• {practice}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Apple className="h-4 w-4" />
                        Nutrition Considerations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">General Principles:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {guidance.nutritionConsiderations.generalPrinciples.map((principle, i) => (
                            <li key={i}>• {principle}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Supportive Nutrients:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {guidance.nutritionConsiderations.specificNutrients.map((nutrient, i) => (
                            <li key={i}>• {nutrient}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Avoid or Monitor:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {guidance.nutritionConsiderations.avoidOrMonitor.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">When to Seek Professional Help:</p>
                      <ul className="text-sm space-y-1">
                        {guidance.redFlags.map((flag, i) => (
                          <li key={i}>• {flag}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </>
              )}
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {guidance.disclaimer}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
