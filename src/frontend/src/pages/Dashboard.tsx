import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '../components/OverviewTab';
import VitalsTab from '../components/VitalsTab';
import OnboardingTab from '../components/OnboardingTab';
import MembershipTab from '../components/MembershipTab';
import AIAssistantTab from '../components/AIAssistantTab';
import RiskDetectionTab from '../components/RiskDetectionTab';
import HealthVaultTab from '../components/HealthVaultTab';
import FitnessTab from '../components/FitnessTab';
import NutritionTab from '../components/NutritionTab';
import MentalHealthTab from '../components/MentalHealthTab';
import RemindersTab from '../components/RemindersTab';
import FamilyHealthTab from '../components/FamilyHealthTab';
import ProfileTab from '../components/ProfileTab';
import TherapyPathwayTab from '../components/mental/pathway/TherapyPathwayTab';
import SleepEstimatorPanel from '../components/mental/sleep-estimator/SleepEstimatorPanel';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleNavigateToMembership = () => {
    setActiveTab('membership');
  };

  const handleNavigateToTherapyPathway = () => {
    setActiveTab('therapy-pathway');
  };

  const handleNavigateToSleepAnalysis = () => {
    setActiveTab('sleep-analysis');
  };

  const handleNavigateToSettings = () => {
    setActiveTab('profile');
  };

  const handleBackFromTherapyPathway = () => {
    setActiveTab('mental');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="mental">Mental Health</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="profile">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="vitals">
          <VitalsTab />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingTab />
        </TabsContent>

        <TabsContent value="mental">
          <MentalHealthTab 
            onNavigateToTherapyPathway={handleNavigateToTherapyPathway}
            onNavigateToSleepAnalysis={handleNavigateToSleepAnalysis}
            onNavigateToSettings={handleNavigateToSettings}
          />
        </TabsContent>

        <TabsContent value="therapy-pathway">
          <TherapyPathwayTab onBack={handleBackFromTherapyPathway} />
        </TabsContent>

        <TabsContent value="sleep-analysis">
          <SleepEstimatorPanel />
        </TabsContent>

        <TabsContent value="membership">
          <MembershipTab />
        </TabsContent>

        <TabsContent value="ai-assistant">
          <AIAssistantTab />
        </TabsContent>

        <TabsContent value="risk-detection">
          <RiskDetectionTab />
        </TabsContent>

        <TabsContent value="health-vault">
          <HealthVaultTab />
        </TabsContent>

        <TabsContent value="fitness">
          <FitnessTab />
        </TabsContent>

        <TabsContent value="nutrition">
          <NutritionTab />
        </TabsContent>

        <TabsContent value="reminders">
          <RemindersTab onNavigateToMembership={handleNavigateToMembership} />
        </TabsContent>

        <TabsContent value="family">
          <FamilyHealthTab />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
