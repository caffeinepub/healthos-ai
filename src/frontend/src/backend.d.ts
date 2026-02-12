import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ModuleProgress {
    moduleId: string;
    isCompleted: boolean;
    artifacts?: Array<string>;
    currentStep: bigint;
    lastSaved: bigint;
}
export interface Intervention {
    id: string;
    startTime: bigint;
    endTime?: bigint;
    name: string;
    type: string;
    progress: number;
    notes: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Profession = {
    __kind__: "musician";
    musician: null;
} | {
    __kind__: "doctor";
    doctor: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "teacher";
    teacher: null;
} | {
    __kind__: "designer";
    designer: null;
} | {
    __kind__: "nurse";
    nurse: null;
} | {
    __kind__: "student";
    student: null;
} | {
    __kind__: "softwareEngineer";
    softwareEngineer: null;
} | {
    __kind__: "artist";
    artist: null;
} | {
    __kind__: "scientist";
    scientist: null;
};
export interface WeeklyAnalytics {
    moodVolatility: number;
    emotionalStability: number;
    cognitiveFatigue: number;
    stressLoad: number;
    riskForecast: number;
    sleepMoodCorrelation: number;
    burnoutIndex: number;
}
export interface SafetyPlan {
    contacts: Array<string>;
    copingStrategies: Array<string>;
    crisisHotlines: Array<string>;
    riskLevel: bigint;
}
export interface NormalizedSleepInput {
    sleepConsistencyScore: number;
    screenTimeBeforeBed: number;
    sleepQualityRating: bigint;
    bedtime: bigint;
    sleepLatency: number;
    stressLevel: bigint;
    napTime?: bigint;
    environmentalQualityScore: number;
    sleepPreparationRating: bigint;
    napDuration?: bigint;
    physicalActivityIntensity: bigint;
    wakeTime: bigint;
    emotionalStateScore: bigint;
    noiseLevelInSleepingArea: bigint;
    brightnessInSleepingArea: bigint;
    nutritionScore: number;
    substanceUseIndicator: boolean;
    cognitiveFatigueScore: bigint;
    caffeineConsumption: number;
    timeZone: string;
    sleepAwakeningCount: bigint;
    sleepDuration: number;
}
export interface ExtendedMentalHealthProfile {
    age?: bigint;
    futureGoals: Array<LifeGoal>;
    displayName: string;
    profession: Profession;
    anonymousMode: boolean;
    gender: bigint;
    consentGiven: boolean;
    timeZone: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AdvancedMetrics {
    respiratoryAnalysis?: {
        breathingRate: number;
        co2RetentionEstimate: number;
        apneaHypopneaIndex: number;
        breathConsistency: number;
        oxygenSaturation: number;
        sleepCycleBreathCorrelation: number;
    };
    microMovementAnalysis?: {
        movementBurstFrequency: number;
        totalSleepMovementIndex: number;
        restlessnessScore: number;
        sleepStageMovementCorrelation: number;
        movementIntensityProfile: number;
    };
    sleepArchitectureAnalysis?: {
        sleepStageTransitions: Array<bigint>;
        sleepStageDurationAnalysis: Array<number>;
        sleepStageDistribution: Array<number>;
        sleepCycleCount: bigint;
    };
    hrvAnalysis?: {
        fragmentIndex: number;
        meanHrv: number;
        sdnn: number;
        circadianRhythmPhase: number;
        sleepStageHrvCorrelation: number;
        rmssd: number;
    };
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface LifeGoal {
    description: string;
    targetYear: bigint;
}
export interface JournalEntry {
    id: string;
    isReframed: boolean;
    cognitiveDistortions: Array<string>;
    content: string;
    catastrophizing: boolean;
    negativeBeliefs: boolean;
    timestamp: bigint;
    emotionalIntensity: bigint;
    beliefStrength: bigint;
    socraticPrompts: Array<string>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface DailyLog {
    id: string;
    emotionTags: Array<string>;
    stressRating: bigint;
    cognitiveClarity: bigint;
    mood: bigint;
    productivity: bigint;
    energyLevel: bigint;
    timestamp: bigint;
    sleepHours: number;
}
export interface AssessmentResult {
    copingStyle: string;
    baselineScore: number;
    stressTriggers: Array<string>;
    personalityProfile: string;
    sleepQualityScore: number;
    bigFive: Array<number>;
    stressReactivityType: string;
    burnoutScore: number;
    timestamp: bigint;
    phq9Score: bigint;
    gad7Score: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface SleepEstimatorRun {
    summaryMetrics: SleepMetrics;
    runTimestamp: bigint;
    riskIndicators: RiskIndicator;
    audioAnalysisMetadata?: {
        duration: number;
        audioFeatureVector: number;
        sampleRate: bigint;
    };
    optimizationSuggestions: Array<string>;
    notes?: string;
    normalizedDailyInputs: Array<NormalizedSleepInput>;
    sensorDataUsed?: {
        accelerometer: boolean;
        heartRateMonitor: boolean;
        breathingSensor: boolean;
        temperatureSensor: boolean;
    };
    daysAnalyzed: bigint;
    advancedMetrics?: AdvancedMetrics;
    dataFormatVersion: string;
}
export interface SleepMetrics {
    sleepConsistencyScore: number;
    sleepLatency: number;
    deepSleepPercentage: number;
    averageSleepDuration: number;
    circadianRhythmScore: number;
    overallSleepHealthScore: number;
    restfulnessScore: number;
    sleepTrend: string;
    remSleepPercentage: number;
    sleepEfficiency: number;
}
export interface RiskIndicator {
    sleepDisorderRisk: number;
    interventionRecommendations: Array<string>;
    sleepImprovementEstimate: number;
    performanceImpactScore: number;
    insomniaLikelihood: number;
    moodInstabilityRisk: number;
    optimizationSuggestions: Array<string>;
    burnoutRisk: number;
    potentialSleepDisruptionFactors: Array<string>;
    cognitiveFatigueRisk: number;
    riskLevel: bigint;
    projectedSleepDebt: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteSleepEstimatorRun(runId: bigint): Promise<void>;
    getAllModuleProgress(): Promise<Array<ModuleProgress>>;
    getAllUsersWithHighRiskFlags(): Promise<Array<Principal>>;
    getAssessment(): Promise<AssessmentResult | null>;
    getCallerUserProfile(): Promise<ExtendedMentalHealthProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyLogs(): Promise<Array<DailyLog>>;
    getInterventions(): Promise<Array<Intervention>>;
    getJournalEntries(): Promise<Array<JournalEntry>>;
    getModuleProgress(moduleId: string): Promise<ModuleProgress | null>;
    getSafetyPlan(): Promise<SafetyPlan | null>;
    getSleepEstimatorRunCount(): Promise<bigint>;
    getSleepEstimatorRuns(limit: bigint | null): Promise<Array<SleepEstimatorRun>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserAssessment(user: Principal): Promise<AssessmentResult | null>;
    getUserDailyLogs(user: Principal): Promise<Array<DailyLog>>;
    getUserInterventions(user: Principal): Promise<Array<Intervention>>;
    getUserJournalEntries(user: Principal): Promise<Array<JournalEntry>>;
    getUserProfile(user: Principal): Promise<ExtendedMentalHealthProfile | null>;
    getUserSafetyPlan(user: Principal): Promise<SafetyPlan | null>;
    getUserSleepEstimatorRunCount(user: Principal): Promise<bigint>;
    getUserSleepEstimatorRuns(user: Principal, limit: bigint | null): Promise<Array<SleepEstimatorRun>>;
    getUserWeeklyAnalytics(user: Principal): Promise<WeeklyAnalytics>;
    getUserWeeklyLogs(user: Principal): Promise<Array<DailyLog>>;
    getWeeklyAnalytics(): Promise<WeeklyAnalytics>;
    getWeeklyLogs(): Promise<Array<DailyLog>>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    revokeConsent(): Promise<void>;
    saveAssessment(result: AssessmentResult): Promise<void>;
    saveCallerUserProfile(profile: ExtendedMentalHealthProfile): Promise<void>;
    saveDailyLog(dayLog: DailyLog): Promise<void>;
    saveIntervention(intervention: Intervention): Promise<void>;
    saveJournalEntry(entry: JournalEntry): Promise<void>;
    saveModuleProgress(progress: ModuleProgress): Promise<void>;
    saveSafetyPlan(plan: SafetyPlan): Promise<void>;
    saveSleepEstimatorRun(run: SleepEstimatorRun): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    toggleAnonymousMode(isAnonymous: boolean): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
