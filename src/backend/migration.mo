import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

module {
  // Previous Gender variant.
  type Gender = {
    #male;
    #female;
    #nonBinary;
    #other : Text;
    #preferNotToSay;
  };

  type Profession = {
    #student;
    #softwareEngineer;
    #doctor;
    #nurse;
    #teacher;
    #artist;
    #musician;
    #designer;
    #scientist;
    #other : Text;
  };

  type LifeGoal = {
    description : Text;
    targetYear : Int;
  };

  type ExtendedMentalHealthProfile = {
    displayName : Text;
    timeZone : Text;
    consentGiven : Bool;
    anonymousMode : Bool;
    age : ?Nat;
    // Previous Gender type (variant), New uses Int.
    gender : Gender;
    profession : Profession;
    futureGoals : [LifeGoal];
  };

  public type AssessmentResult = {
    phq9Score : Nat;
    gad7Score : Nat;
    burnoutScore : Float;
    bigFive : [Float];
    sleepQualityScore : Float;
    copingStyle : Text;
    stressTriggers : [Text];
    baselineScore : Float;
    personalityProfile : Text;
    stressReactivityType : Text;
    timestamp : Int;
  };

  public type DailyLog = {
    id : Text;
    mood : Int;
    emotionTags : [Text];
    sleepHours : Float;
    energyLevel : Int;
    cognitiveClarity : Int;
    stressRating : Int;
    productivity : Int;
    timestamp : Int;
  };

  public type JournalEntry = {
    id : Text;
    content : Text;
    cognitiveDistortions : [Text];
    emotionalIntensity : Int;
    negativeBeliefs : Bool;
    catastrophizing : Bool;
    socraticPrompts : [Text];
    beliefStrength : Int;
    isReframed : Bool;
    timestamp : Int;
  };

  public type Intervention = {
    id : Text;
    name : Text;
    type_ : Text;
    progress : Float;
    startTime : Int;
    endTime : ?Int;
    notes : Text;
  };

  public type SafetyPlan = {
    contacts : [Text];
    copingStrategies : [Text];
    crisisHotlines : [Text];
    riskLevel : Int;
  };

  public type WeeklyAnalytics = {
    stressLoad : Float;
    burnoutIndex : Float;
    emotionalStability : Float;
    cognitiveFatigue : Float;
    sleepMoodCorrelation : Float;
    moodVolatility : Float;
    riskForecast : Float;
  };

  public type ModuleProgress = {
    moduleId : Text;
    currentStep : Nat;
    isCompleted : Bool;
    lastSaved : Int;
    artifacts : ?[Text];
  };

  public type SleepMetrics = {
    averageSleepDuration : Float;
    sleepEfficiency : Float;
    sleepLatency : Float;
    deepSleepPercentage : Float;
    remSleepPercentage : Float;
    sleepConsistencyScore : Float;
    restfulnessScore : Float;
    circadianRhythmScore : Float;
    sleepTrend : Text;
    overallSleepHealthScore : Float;
  };

  public type RiskIndicator = {
    sleepDisorderRisk : Float;
    burnoutRisk : Float;
    moodInstabilityRisk : Float;
    cognitiveFatigueRisk : Float;
    potentialSleepDisruptionFactors : [Text];
    optimizationSuggestions : [Text];
    sleepImprovementEstimate : Float;
    projectedSleepDebt : Float;
    riskLevel : Int;
    insomniaLikelihood : Float;
    performanceImpactScore : Float;
    interventionRecommendations : [Text];
  };

  public type AdvancedMetrics = {
    hrvAnalysis : ?{
      meanHrv : Float;
      sdnn : Float;
      rmssd : Float;
      fragmentIndex : Float;
      sleepStageHrvCorrelation : Float;
      circadianRhythmPhase : Float;
    };
    respiratoryAnalysis : ?{
      breathingRate : Float;
      apneaHypopneaIndex : Float;
      oxygenSaturation : Float;
      co2RetentionEstimate : Float;
      breathConsistency : Float;
      sleepCycleBreathCorrelation : Float;
    };
    microMovementAnalysis : ?{
      movementIntensityProfile : Float;
      restlessnessScore : Float;
      movementBurstFrequency : Float;
      sleepStageMovementCorrelation : Float;
      totalSleepMovementIndex : Float;
    };
    sleepArchitectureAnalysis : ?{
      sleepStageDistribution : [Float];
      sleepCycleCount : Nat;
      sleepStageTransitions : [Nat];
      sleepStageDurationAnalysis : [Float];
    };
  };

  public type NormalizedSleepInput = {
    timeZone : Text;
    bedtime : Int;
    wakeTime : Int;
    sleepDuration : Float;
    sleepQualityRating : Int;
    napTime : ?Int;
    napDuration : ?Int;
    physicalActivityIntensity : Int;
    screenTimeBeforeBed : Float;
    nutritionScore : Float;
    caffeineConsumption : Float;
    substanceUseIndicator : Bool;
    stressLevel : Int;
    cognitiveFatigueScore : Int;
    emotionalStateScore : Int;
    sleepPreparationRating : Int;
    sleepConsistencyScore : Float;
    sleepAwakeningCount : Nat;
    brightnessInSleepingArea : Int;
    noiseLevelInSleepingArea : Int;
    sleepLatency : Float;
    environmentalQualityScore : Float;
  };

  public type SleepEstimatorRun = {
    runTimestamp : Int;
    daysAnalyzed : Nat;
    summaryMetrics : SleepMetrics;
    riskIndicators : RiskIndicator;
    optimizationSuggestions : [Text];
    advancedMetrics : ?AdvancedMetrics;
    normalizedDailyInputs : [NormalizedSleepInput];
    audioAnalysisMetadata : ?{
      sampleRate : Nat;
      duration : Float;
      audioFeatureVector : Float;
    };
    sensorDataUsed : ?{
      accelerometer : Bool;
      heartRateMonitor : Bool;
      breathingSensor : Bool;
      temperatureSensor : Bool;
    };
    dataFormatVersion : Text;
    notes : ?Text;
  };

  public type OldActor = {
    profiles : Map.Map<Principal, ExtendedMentalHealthProfile>;
    assessments : Map.Map<Principal, AssessmentResult>;
    dailyLogs : Map.Map<Principal, Map.Map<Text, DailyLog>>;
    journals : Map.Map<Principal, Map.Map<Text, JournalEntry>>;
    interventions : Map.Map<Principal, Map.Map<Text, Intervention>>;
    safetyPlans : Map.Map<Principal, SafetyPlan>;
    moduleProgress : Map.Map<Principal, Map.Map<Text, ModuleProgress>>;
    userProfiles : Map.Map<Principal, Text>;
    sleepEstimatorRuns : Map.Map<Principal, Map.Map<Nat, SleepEstimatorRun>>;
    nextSleepRunId : Nat;
  };

  type ProfessionNew = {
    #student;
    #softwareEngineer;
    #doctor;
    #nurse;
    #teacher;
    #artist;
    #musician;
    #designer;
    #scientist;
    #other : Text;
  };

  type LifeGoalNew = {
    description : Text;
    targetYear : Int;
  };

  type ExtendedMentalHealthProfileNew = {
    displayName : Text;
    timeZone : Text;
    consentGiven : Bool;
    anonymousMode : Bool;
    age : ?Nat;
    // Switch from previous (variant) Gender type to Int.
    gender : Int;
    profession : ProfessionNew;
    futureGoals : [LifeGoalNew];
  };

  public type NewActor = {
    profiles : Map.Map<Principal, ExtendedMentalHealthProfileNew>;
    assessments : Map.Map<Principal, AssessmentResult>;
    dailyLogs : Map.Map<Principal, Map.Map<Text, DailyLog>>;
    journals : Map.Map<Principal, Map.Map<Text, JournalEntry>>;
    interventions : Map.Map<Principal, Map.Map<Text, Intervention>>;
    safetyPlans : Map.Map<Principal, SafetyPlan>;
    moduleProgress : Map.Map<Principal, Map.Map<Text, ModuleProgress>>;
    userProfiles : Map.Map<Principal, Text>;
    sleepEstimatorRuns : Map.Map<Principal, Map.Map<Nat, SleepEstimatorRun>>;
    nextSleepRunId : Nat;
  };

  func convertGender(gender : Gender) : Int {
    switch (gender) {
      case (#male) { 0 };
      case (#female) { 1 };
      case (#nonBinary) { 2 };
      case (#other(_)) { 3 };
      case (#preferNotToSay) { 4 };
    };
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      profiles = old.profiles.map<Principal, ExtendedMentalHealthProfile, ExtendedMentalHealthProfileNew>(
        func(
          _,
          profile,
        ) {
          {
            profile with
            gender = convertGender(profile.gender);
          };
        }
      );
    };
  };
};
