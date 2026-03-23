import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  let profiles = Map.empty<Principal, ExtendedMentalHealthProfile>();
  let assessments = Map.empty<Principal, AssessmentResult>();
  let dailyLogs = Map.empty<Principal, Map.Map<Text, DailyLog>>();
  let journals = Map.empty<Principal, Map.Map<Text, JournalEntry>>();
  let interventions = Map.empty<Principal, Map.Map<Text, Intervention>>();
  let safetyPlans = Map.empty<Principal, SafetyPlan>();
  let moduleProgress = Map.empty<Principal, Map.Map<Text, ModuleProgress>>();
  let userProfiles = Map.empty<Principal, Text>();
  let sleepEstimatorRuns = Map.empty<Principal, Map.Map<Nat, SleepEstimatorRun>>();
  var nextSleepRunId = 0;

  let clinicalProfiles = Map.empty<Principal, ClinicalProfile>();
  let patientRecords = Map.empty<Text, PatientRecord>();
  let soapNotes = Map.empty<Text, SoapNote>();
  let prescriptions = Map.empty<Text, Prescription>();
  let followUps = Map.empty<Text, FollowUp>();
  let auditLogs = Map.empty<Text, AuditLogEntry>();
  let revenueEntries = Map.empty<Text, RevenueEntry>();
  let riskFlags = Map.empty<Text, PredictiveRiskFlag>();
  var nextPatientId = 1;
  var nextAuditId = 1;

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

  func assertUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func assertAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func assertUserOrAdmin(caller : Principal, targetUser : Principal) {
    if (caller != targetUser and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only access your own data or be an admin");
    };
  };

  func assertConsent(caller : Principal) {
    switch (profiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: User profile not found. Please create a profile first.");
      };
      case (?profile) {
        if (not profile.consentGiven) {
          Runtime.trap("Unauthorized: Consent required to save data. Please provide consent in your profile.");
        };
      };
    };
  };

  func getClinicalRole(caller : Principal) : ?ClinicalRole {
    switch (clinicalProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.clinicalRole };
    };
  };

  func assertClinicalRole(caller : Principal, allowedRoles : [ClinicalRole]) {
    switch (getClinicalRole(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: No clinical profile found. Please create a clinical profile first.");
      };
      case (?role) {
        var hasRole = false;
        for (allowedRole in allowedRoles.vals()) {
          if (role == allowedRole) {
            hasRole := true;
          };
        };
        if (not hasRole) {
          Runtime.trap("Unauthorized: Insufficient clinical role permissions");
        };
      };
    };
  };

  func assertDoctorOrNurse(caller : Principal) {
    assertClinicalRole(caller, [#doctor, #nurse]);
  };

  func assertDoctor(caller : Principal) {
    assertClinicalRole(caller, [#doctor]);
  };

  func assertAdminOrBilling(caller : Principal) {
    assertClinicalRole(caller, [#admin, #billing]);
  };

  func getPatientPrincipalFromRecord(patientId : Text) : ?Principal {
    switch (patientRecords.get(patientId)) {
      case (null) { null };
      case (?record) { ?record.patientPrincipal };
    };
  };

  func assertPatientOwnership(caller : Principal, patientId : Text) {
    switch (getPatientPrincipalFromRecord(patientId)) {
      case (null) {
        Runtime.trap("Unauthorized: Patient record not found");
      };
      case (?patientPrincipal) {
        if (caller != patientPrincipal) {
          Runtime.trap("Unauthorized: Can only access your own patient data");
        };
      };
    };
  };

  func assertDoctorOrPatient(caller : Principal, patientId : Text) {
    let isDoctor = switch (getClinicalRole(caller)) {
      case (?#doctor) { true };
      case (_) { false };
    };

    if (not isDoctor) {
      assertPatientOwnership(caller, patientId);
    };
  };

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : ExtendedMentalHealthProfile) : async () {
    assertUser(caller);
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?ExtendedMentalHealthProfile {
    assertUser(caller);
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?ExtendedMentalHealthProfile {
    assertUserOrAdmin(caller, user);
    profiles.get(user);
  };

  public shared ({ caller }) func revokeConsent() : async () {
    assertUser(caller);
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No profile found") };
      case (?p) { p };
    };
    let updatedProfile = { profile with consentGiven = false };
    profiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func toggleAnonymousMode(isAnonymous : Bool) : async () {
    assertUser(caller);
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No profile found") };
      case (?p) { p };
    };
    let updatedProfile = { profile with anonymousMode = isAnonymous };
    profiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func saveAssessment(result : AssessmentResult) : async () {
    assertUser(caller);
    assessments.add(caller, result);
  };

  public query ({ caller }) func getAssessment() : async ?AssessmentResult {
    assertUser(caller);
    assessments.get(caller);
  };

  public query ({ caller }) func getUserAssessment(user : Principal) : async ?AssessmentResult {
    assertUserOrAdmin(caller, user);
    assessments.get(user);
  };

  public shared ({ caller }) func saveDailyLog(dayLog : DailyLog) : async () {
    assertUser(caller);
    let userLog = switch (dailyLogs.get(caller)) {
      case (null) { Map.empty<Text, DailyLog>() };
      case (?logs) { logs };
    };
    userLog.add(dayLog.id, dayLog);
    dailyLogs.add(caller, userLog);
  };

  public query ({ caller }) func getDailyLogs() : async [DailyLog] {
    assertUser(caller);
    switch (dailyLogs.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  public query ({ caller }) func getUserDailyLogs(user : Principal) : async [DailyLog] {
    assertUserOrAdmin(caller, user);
    switch (dailyLogs.get(user)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  func getWeeklyLogsInternal(user : Principal) : [DailyLog] {
    switch (dailyLogs.get(user)) {
      case (null) { [] };
      case (?entries) {
        let currentTime = Time.now();
        let minTime = currentTime - (7 * 24 * 60 * 60 * 1000_000_000);
        entries.values().toArray().filter<DailyLog>(
          func(log) { log.timestamp >= minTime }
        );
      };
    };
  };

  public query ({ caller }) func getWeeklyLogs() : async [DailyLog] {
    assertUser(caller);
    getWeeklyLogsInternal(caller);
  };

  public query ({ caller }) func getUserWeeklyLogs(user : Principal) : async [DailyLog] {
    assertUserOrAdmin(caller, user);
    getWeeklyLogsInternal(user);
  };

  func computeWeeklyAnalytics(logs : [DailyLog]) : WeeklyAnalytics {
    let size = logs.size();
    if (size == 0) {
      return {
        stressLoad = 0.0;
        burnoutIndex = 0.0;
        emotionalStability = 0.0;
        cognitiveFatigue = 0.0;
        sleepMoodCorrelation = 0.0;
        moodVolatility = 0.0;
        riskForecast = 0.0;
      };
    };

    let sizeFloat = size.toFloat();

    var stressSum : Float = 0.0;
    var productivitySum : Float = 0.0;
    var moodSum : Float = 0.0;
    var energySum : Float = 0.0;
    var sleepSum : Float = 0.0;

    for (log in logs.vals()) {
      stressSum += log.stressRating.toFloat();
      productivitySum += log.productivity.toFloat();
      moodSum += log.mood.toFloat();
      energySum += log.energyLevel.toFloat();
      sleepSum += log.sleepHours;
    };

    let stressLoad = stressSum / sizeFloat;
    let burnoutIndex = (10.0 - (productivitySum / sizeFloat)) / 10.0;
    let emotionalStability = moodSum / sizeFloat;
    let cognitiveFatigue = (10.0 - (energySum / sizeFloat)) / 10.0;
    let sleepMoodCorrelation = sleepSum / sizeFloat;

    var moodVariance = 0.0;
    let avgMood = moodSum / sizeFloat;
    for (log in logs.vals()) {
      let diff = log.mood.toFloat() - avgMood;
      moodVariance += diff * diff;
    };
    let moodVolatility = Float.sqrt(moodVariance / sizeFloat);

    let riskForecast = (stressLoad + burnoutIndex + cognitiveFatigue) / 3.0;

    {
      stressLoad;
      burnoutIndex;
      emotionalStability;
      cognitiveFatigue;
      sleepMoodCorrelation;
      moodVolatility;
      riskForecast;
    };
  };

  public query ({ caller }) func getWeeklyAnalytics() : async WeeklyAnalytics {
    assertUser(caller);
    let logs = getWeeklyLogsInternal(caller);
    computeWeeklyAnalytics(logs);
  };

  public query ({ caller }) func getUserWeeklyAnalytics(user : Principal) : async WeeklyAnalytics {
    assertUserOrAdmin(caller, user);
    let logs = getWeeklyLogsInternal(user);
    computeWeeklyAnalytics(logs);
  };

  public shared ({ caller }) func saveJournalEntry(entry : JournalEntry) : async () {
    assertUser(caller);

    let profile = profiles.get(caller);
    let finalEntry = switch (profile) {
      case (?p) {
        if (p.anonymousMode) {
          { entry with content = "" };
        } else {
          entry;
        };
      };
      case (null) { entry };
    };

    let userJournals = switch (journals.get(caller)) {
      case (null) { Map.empty<Text, JournalEntry>() };
      case (?journals) { journals };
    };
    userJournals.add(finalEntry.id, finalEntry);
    journals.add(caller, userJournals);
  };

  public query ({ caller }) func getJournalEntries() : async [JournalEntry] {
    assertUser(caller);
    switch (journals.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  public query ({ caller }) func getUserJournalEntries(user : Principal) : async [JournalEntry] {
    assertUserOrAdmin(caller, user);
    switch (journals.get(user)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  public shared ({ caller }) func saveIntervention(intervention : Intervention) : async () {
    assertUser(caller);
    let userInterventions = switch (interventions.get(caller)) {
      case (null) { Map.empty<Text, Intervention>() };
      case (?interventions) { interventions };
    };
    userInterventions.add(intervention.id, intervention);
    interventions.add(caller, userInterventions);
  };

  public query ({ caller }) func getInterventions() : async [Intervention] {
    assertUser(caller);
    switch (interventions.get(caller)) {
      case (null) { [] };
      case (?interventions) { interventions.values().toArray() };
    };
  };

  public query ({ caller }) func getUserInterventions(user : Principal) : async [Intervention] {
    assertUserOrAdmin(caller, user);
    switch (interventions.get(user)) {
      case (null) { [] };
      case (?interventions) { interventions.values().toArray() };
    };
  };

  public shared ({ caller }) func saveSafetyPlan(plan : SafetyPlan) : async () {
    assertUser(caller);
    safetyPlans.add(caller, plan);
  };

  public query ({ caller }) func getSafetyPlan() : async ?SafetyPlan {
    assertUser(caller);
    safetyPlans.get(caller);
  };

  public query ({ caller }) func getUserSafetyPlan(user : Principal) : async ?SafetyPlan {
    assertUserOrAdmin(caller, user);
    safetyPlans.get(user);
  };

  public query ({ caller }) func getAllUsersWithHighRiskFlags() : async [Principal] {
    assertAdmin(caller);
    let highRiskUsers = safetyPlans.entries().toArray().filter(
      func((_, plan)) { plan.riskLevel >= 7 }
    );
    highRiskUsers.map<(Principal, SafetyPlan), Principal>(func((principal, _)) { principal });
  };

  public shared ({ caller }) func saveModuleProgress(progress : ModuleProgress) : async () {
    assertUser(caller);
    let userProgress = switch (moduleProgress.get(caller)) {
      case (null) { Map.empty<Text, ModuleProgress>() };
      case (?progressMap) { progressMap };
    };
    userProgress.add(progress.moduleId, progress);
    moduleProgress.add(caller, userProgress);
  };

  public query ({ caller }) func getModuleProgress(moduleId : Text) : async ?ModuleProgress {
    assertUser(caller);
    switch (moduleProgress.get(caller)) {
      case (null) { null };
      case (?progressMap) { progressMap.get(moduleId) };
    };
  };

  public query ({ caller }) func getAllModuleProgress() : async [ModuleProgress] {
    assertUser(caller);
    switch (moduleProgress.get(caller)) {
      case (null) { [] };
      case (?progressMap) { progressMap.values().toArray() };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    assertAdmin(caller);
    stripeConfig := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be configured first") };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    assertUser(caller);
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func saveSleepEstimatorRun(run : SleepEstimatorRun) : async () {
    assertUser(caller);
    assertConsent(caller);
    let userRuns = switch (sleepEstimatorRuns.get(caller)) {
      case (null) { Map.empty<Nat, SleepEstimatorRun>() };
      case (?runs) { runs };
    };
    userRuns.add(nextSleepRunId, run);
    sleepEstimatorRuns.add(caller, userRuns);
    nextSleepRunId += 1;
  };

  public query ({ caller }) func getSleepEstimatorRuns(limit : ?Nat) : async [SleepEstimatorRun] {
    assertUser(caller);
    switch (sleepEstimatorRuns.get(caller)) {
      case (null) { [] };
      case (?runs) {
        let runsArray = runs.values().toArray();
        switch (limit) {
          case (?l) {
            Array.tabulate< SleepEstimatorRun >(Nat.min(l, runsArray.size()), func(i) { runsArray[i] });
          };
          case (null) { runsArray };
        };
      };
    };
  };

  public query ({ caller }) func getUserSleepEstimatorRuns(user : Principal, limit : ?Nat) : async [SleepEstimatorRun] {
    assertUserOrAdmin(caller, user);
    switch (sleepEstimatorRuns.get(user)) {
      case (null) { [] };
      case (?runs) {
        let runsArray = runs.values().toArray();
        switch (limit) {
          case (?l) {
            Array.tabulate< SleepEstimatorRun >(Nat.min(l, runsArray.size()), func(i) { runsArray[i] });
          };
          case (null) { runsArray };
        };
      };
    };
  };

  public query ({ caller }) func getSleepEstimatorRunCount() : async Nat {
    assertUser(caller);
    switch (sleepEstimatorRuns.get(caller)) {
      case (null) { 0 };
      case (?runs) { runs.size() };
    };
  };

  public query ({ caller }) func getUserSleepEstimatorRunCount(user : Principal) : async Nat {
    assertUserOrAdmin(caller, user);
    switch (sleepEstimatorRuns.get(user)) {
      case (null) { 0 };
      case (?runs) { runs.size() };
    };
  };

  public shared ({ caller }) func deleteSleepEstimatorRun(runId : Nat) : async () {
    assertUser(caller);
    switch (sleepEstimatorRuns.get(caller)) {
      case (null) { Runtime.trap("No sleep runs found for user") };
      case (?runs) {
        if (not runs.containsKey(runId)) {
          Runtime.trap("Sleep run not found");
        };
        runs.remove(runId);
        sleepEstimatorRuns.add(caller, runs);
      };
    };
  };

  public shared ({ caller }) func saveClinicalProfile(profile : ClinicalProfile) : async () {
    assertUser(caller);
    clinicalProfiles.add(caller, profile);
    logAuditEntryHelper(caller, "SAVE_CLINICAL_PROFILE", caller.toText(), "Clinical profile saved");
  };

  public query ({ caller }) func getClinicalProfile() : async ?ClinicalProfile {
    assertUser(caller);
    clinicalProfiles.get(caller);
  };

  public shared ({ caller }) func createPatientRecord(record : PatientRecord) : async Text {
    assertUser(caller);
    assertDoctor(caller);

    let updatedId = "PATIENT-" # nextPatientId.toText();
    nextPatientId += 1;

    clinicalProfiles.add(record.patientPrincipal, {
      clinicalRole = #patient;
      specialty = "";
      licenseNumber = "";
      hospitalName = "";
      department = "";
      linkedPatients = [];
      principal = record.patientPrincipal;
    });

    patientRecords.add(updatedId, { record with id = updatedId });
    logAuditEntryHelper(caller, "CREATE_PATIENT_RECORD", updatedId, "Patient record created");
    updatedId;
  };

  public query ({ caller }) func getPatientRecord(patientId : Text) : async ?PatientRecord {
    assertUser(caller);
    assertDoctorOrPatient(caller, patientId);
    patientRecords.get(patientId);
  };

  public query ({ caller }) func listDoctorPatients(doctorPrincipal : Principal) : async [PatientRecord] {
    assertUser(caller);
    if (caller != doctorPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only list your own patients or be an admin");
    };
    assertDoctor(doctorPrincipal);

    let records = patientRecords.values().toArray();
    records.filter(func(r) { r.assignedDoctor == doctorPrincipal });
  };

  public shared ({ caller }) func updatePatientRiskScore(patientId : Text, riskScore : Float) : async () {
    assertUser(caller);
    assertDoctor(caller);

    switch (patientRecords.get(patientId)) {
      case (null) { Runtime.trap("Patient record not found") };
      case (?record) {
        let updatedRecord = { record with riskScore };
        patientRecords.add(patientId, updatedRecord);
        logAuditEntryHelper(caller, "UPDATE_RISK_SCORE", patientId, "Risk score updated to " # riskScore.toText());
      };
    };
  };

  public shared ({ caller }) func saveSoapNote(note : SoapNote) : async () {
    assertUser(caller);
    assertDoctor(caller);

    if (note.doctorPrincipal != caller) {
      Runtime.trap("Unauthorized: Can only create SOAP notes as yourself");
    };

    soapNotes.add(note.id, note);
    logAuditEntryHelper(caller, "SAVE_SOAP_NOTE", note.id, "SOAP note saved for patient " # note.patientId);
  };

  public query ({ caller }) func getSoapNote(noteId : Text) : async ?SoapNote {
    assertUser(caller);

    switch (soapNotes.get(noteId)) {
      case (null) { null };
      case (?note) {
        assertDoctorOrPatient(caller, note.patientId);
        ?note;
      };
    };
  };

  public query ({ caller }) func getPatientSoapNotes(patientId : Text) : async [SoapNote] {
    assertUser(caller);
    assertDoctorOrPatient(caller, patientId);

    let notes = soapNotes.values().toArray();
    notes.filter(func(n) { n.patientId == patientId });
  };

  public shared ({ caller }) func savePrescription(prescription : Prescription) : async () {
    assertUser(caller);
    assertDoctor(caller);

    if (prescription.doctorPrincipal != caller) {
      Runtime.trap("Unauthorized: Can only create prescriptions as yourself");
    };

    prescriptions.add(prescription.id, prescription);
    logAuditEntryHelper(caller, "SAVE_PRESCRIPTION", prescription.id, "Prescription saved for patient " # prescription.patientId);
  };

  public query ({ caller }) func getPrescription(prescriptionId : Text) : async ?Prescription {
    assertUser(caller);

    switch (prescriptions.get(prescriptionId)) {
      case (null) { null };
      case (?presc) {
        assertDoctorOrPatient(caller, presc.patientId);
        ?presc;
      };
    };
  };

  public query ({ caller }) func getPatientPrescriptions(patientId : Text) : async [Prescription] {
    assertUser(caller);
    assertDoctorOrPatient(caller, patientId);

    let presc = prescriptions.values().toArray();
    presc.filter(func(p) { p.patientId == patientId });
  };

  public shared ({ caller }) func saveFollowUp(followUp : FollowUp) : async () {
    assertUser(caller);
    assertDoctorOrNurse(caller);

    if (followUp.scheduledBy != caller) {
      Runtime.trap("Unauthorized: Can only create follow-ups as yourself");
    };

    followUps.add(followUp.id, followUp);
    logAuditEntryHelper(caller, "SAVE_FOLLOW_UP", followUp.id, "Follow-up saved for patient " # followUp.patientId);
  };

  public query ({ caller }) func getPatientFollowUps(patientId : Text) : async [FollowUp] {
    assertUser(caller);
    assertDoctorOrPatient(caller, patientId);

    let ups = followUps.values().toArray();
    ups.filter(func(f) { f.patientId == patientId });
  };

  public shared ({ caller }) func updateFollowUpStatus(followUpId : Text, status : Text) : async () {
    assertUser(caller);
    assertDoctorOrNurse(caller);

    switch (followUps.get(followUpId)) {
      case (null) { Runtime.trap("Follow-up not found") };
      case (?followUp) {
        let updatedFollowUp = { followUp with status };
        followUps.add(followUpId, updatedFollowUp);
        logAuditEntryHelper(caller, "UPDATE_FOLLOW_UP_STATUS", followUpId, "Status updated to " # status);
      };
    };
  };

  func logAuditEntryHelper(actorPrincipal : Principal, action : Text, targetId : Text, details : Text) {
    let logId = "AUDIT-" # nextAuditId.toText();
    nextAuditId += 1;
    auditLogs.add(
      logId,
      {
        actorPrincipal;
        action;
        targetId;
        details;
        id = logId;
        timestamp = Int.abs(Time.now());
      },
    );
  };

  public query ({ caller }) func getAuditLog() : async [AuditLogEntry] {
    assertUser(caller);
    assertClinicalRole(caller, [#admin]);

    let logs = auditLogs.values().toArray();
    logs.sort(
      func(a, b) {
        if (a.timestamp > b.timestamp) { #greater } else { #less };
      }
    );
  };

  public shared ({ caller }) func recordRevenueEntry(entry : RevenueEntry) : async () {
    assertUser(caller);
    assertAdminOrBilling(caller);

    revenueEntries.add(entry.id, entry);
    logAuditEntryHelper(caller, "RECORD_REVENUE", entry.id, "Revenue entry: " # entry.amount.toText() # " " # entry.currency);
  };

  public query ({ caller }) func getRevenueSummary() : async {
    total : Float;
    byDay : [Float];
  } {
    assertUser(caller);
    assertAdminOrBilling(caller);

    var total : Float = 0.0;
    var dailyTotals = Map.empty<Int, Float>();

    for (entry in revenueEntries.values()) {
      total += entry.amount;
      let dayKey = entry.timestamp / (24 * 60 * 60 * 1000_000_000);

      switch (dailyTotals.get(dayKey)) {
        case (null) {
          dailyTotals.add(dayKey, entry.amount);
        };
        case (?existing) {
          dailyTotals.add(dayKey, existing + entry.amount);
        };
      };
    };

    let startDay = Time.now() / (24 * 60 * 60 * 1000_000_000) - 29;

    let byDay = Array.tabulate(
      30,
      func(i) {
        let dayKey = startDay + Int.abs(i);
        switch (dailyTotals.get(dayKey)) {
          case (null) { 0.0 };
          case (?amount) { amount };
        };
      },
    );

    {
      total;
      byDay;
    };
  };

  public shared ({ caller }) func savePredictiveRiskFlag(flag : PredictiveRiskFlag) : async () {
    assertUser(caller);
    assertDoctor(caller);

    riskFlags.add(flag.patientId, flag);
    logAuditEntryHelper(caller, "SAVE_RISK_FLAG", flag.patientId, "Risk flag saved with score " # flag.riskScore.toText());
  };

  public query ({ caller }) func getHighRiskPatients() : async [PredictiveRiskFlag] {
    assertUser(caller);
    assertDoctorOrNurse(caller);

    let flags = riskFlags.values().toArray();
    flags.filter(
      func(f) { f.riskScore >= 0.8 or f.severity == "HIGH" }
    );
  };

  public query ({ caller }) func getPatientRiskFlag(patientId : Text) : async ?PredictiveRiskFlag {
    assertUser(caller);
    assertDoctorOrPatient(caller, patientId);

    riskFlags.get(patientId);
  };
};
