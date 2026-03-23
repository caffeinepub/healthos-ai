import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type Profession = {
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

  public type LifeGoal = {
    description : Text;
    targetYear : Int;
  };

  public type ClinicalRole = {
    #doctor;
    #nurse;
    #admin;
    #billing;
    #patient;
  };

  public type ExtendedMentalHealthProfile = {
    displayName : Text;
    timeZone : Text;
    consentGiven : Bool;
    anonymousMode : Bool;
    age : ?Nat;
    gender : Int;
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

  public type ClinicalProfile = {
    principal : Principal;
    clinicalRole : ClinicalRole;
    specialty : Text;
    licenseNumber : Text;
    hospitalName : Text;
    department : Text;
    linkedPatients : [Principal];
  };

  public type PatientRecord = {
    id : Text;
    patientPrincipal : Principal;
    assignedDoctor : Principal;
    name : Text;
    age : Nat;
    gender : Text;
    bloodType : Text;
    allergies : [Text];
    diagnoses : [Text];
    notes : Text;
    riskScore : Float;
    lastVisit : Int;
    createdAt : Int;
  };

  public type SoapNote = {
    id : Text;
    patientId : Text;
    doctorPrincipal : Principal;
    subjective : Text;
    objective : Text;
    assessment : Text;
    plan : Text;
    icdCodes : [Text];
    specialty : Text;
    confidenceScore : Float;
    voiceTranscript : ?Text;
    timestamp : Int;
  };

  public type Prescription = {
    id : Text;
    patientId : Text;
    doctorPrincipal : Principal;
    medications : [{ name : Text; dosage : Text; frequency : Text; duration : Text }];
    instructions : Text;
    icdCodes : [Text];
    status : Text;
    timestamp : Int;
  };

  public type FollowUp = {
    id : Text;
    patientId : Text;
    scheduledBy : Principal;
    scheduledDate : Int;
    reason : Text;
    priority : Text;
    status : Text;
    notes : Text;
    createdAt : Int;
  };

  public type AuditLogEntry = {
    id : Text;
    actorPrincipal : Principal;
    action : Text;
    targetId : Text;
    details : Text;
    timestamp : Int;
  };

  public type RevenueEntry = {
    id : Text;
    amount : Float;
    currency : Text;
    source : Text;
    patientId : ?Text;
    description : Text;
    timestamp : Int;
  };

  public type PredictiveRiskFlag = {
    patientId : Text;
    riskScore : Float;
    riskFactors : [Text];
    recommendations : [Text];
    flaggedAt : Int;
    severity : Text;
  };

  public type OldActor = {
    profiles : Map.Map<Principal, ExtendedMentalHealthProfile>;
    assessments : Map.Map<Principal, AssessmentResult>;
    dailyLogs : Map.Map<Principal, Map.Map<Text, DailyLog>>;
    journals : Map.Map<Principal, Map.Map<Text, JournalEntry>>;
    interventions : Map.Map<Principal, Map.Map<Text, Intervention>>;
    safetyPlans : Map.Map<Principal, SafetyPlan>;
    moduleProgress : Map.Map<Principal, Map.Map<Text, ModuleProgress>>;
    sleepEstimatorRuns : Map.Map<Principal, Map.Map<Nat, SleepEstimatorRun>>;
    nextSleepRunId : Nat;
  };

  public type NewActor = {
    profiles : Map.Map<Principal, ExtendedMentalHealthProfile>;
    assessments : Map.Map<Principal, AssessmentResult>;
    dailyLogs : Map.Map<Principal, Map.Map<Text, DailyLog>>;
    journals : Map.Map<Principal, Map.Map<Text, JournalEntry>>;
    interventions : Map.Map<Principal, Map.Map<Text, Intervention>>;
    safetyPlans : Map.Map<Principal, SafetyPlan>;
    moduleProgress : Map.Map<Principal, Map.Map<Text, ModuleProgress>>;
    sleepEstimatorRuns : Map.Map<Principal, Map.Map<Nat, SleepEstimatorRun>>;
    nextSleepRunId : Nat;
    clinicalProfiles : Map.Map<Principal, ClinicalProfile>;
    patientRecords : Map.Map<Text, PatientRecord>;
    soapNotes : Map.Map<Text, SoapNote>;
    prescriptions : Map.Map<Text, Prescription>;
    followUps : Map.Map<Text, FollowUp>;
    auditLogs : Map.Map<Text, AuditLogEntry>;
    revenueEntries : Map.Map<Text, RevenueEntry>;
    riskFlags : Map.Map<Text, PredictiveRiskFlag>;
    nextPatientId : Nat;
    nextAuditId : Nat;
  };

  func transformSleepEstimatorRun(run : SleepEstimatorRun) : SleepEstimatorRun {
    { run with advancedMetrics = null };
  };

  public func run(old : OldActor) : NewActor {
    {
      profiles = old.profiles;
      assessments = old.assessments;
      dailyLogs = old.dailyLogs;
      journals = old.journals;
      interventions = old.interventions;
      safetyPlans = old.safetyPlans;
      moduleProgress = old.moduleProgress;
      sleepEstimatorRuns = old.sleepEstimatorRuns.map<Principal, Map.Map<Nat, SleepEstimatorRun>, Map.Map<Nat, SleepEstimatorRun>>(
        func(_p, runs) {
          runs.map<Nat, SleepEstimatorRun, SleepEstimatorRun>(
            func(_id, run) { transformSleepEstimatorRun(run) }
          );
        }
      );
      nextSleepRunId = old.nextSleepRunId;
      clinicalProfiles = Map.empty<Principal, ClinicalProfile>();
      patientRecords = Map.empty<Text, PatientRecord>();
      soapNotes = Map.empty<Text, SoapNote>();
      prescriptions = Map.empty<Text, Prescription>();
      followUps = Map.empty<Text, FollowUp>();
      auditLogs = Map.empty<Text, AuditLogEntry>();
      revenueEntries = Map.empty<Text, RevenueEntry>();
      riskFlags = Map.empty<Text, PredictiveRiskFlag>();
      nextPatientId = 1;
      nextAuditId = 1;
    };
  };
};
