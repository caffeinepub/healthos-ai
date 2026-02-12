import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { 
  ExtendedMentalHealthProfile, 
  ShoppingItem, 
  AssessmentResult, 
  DailyLog, 
  JournalEntry, 
  Intervention, 
  SafetyPlan,
  WeeklyAnalytics,
  ModuleProgress,
  SleepEstimatorRun
} from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<ExtendedMentalHealthProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ExtendedMentalHealthProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRevokeConsent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.revokeConsent();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useToggleAnonymousMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isAnonymous: boolean) => {
      if (!actor) throw new Error('Actor not available');
      await actor.toggleAnonymousMode(isAnonymous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAssessment() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AssessmentResult | null>({
    queryKey: ['assessment'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAssessment();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: AssessmentResult) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveAssessment(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyAnalytics'] });
    },
  });
}

export function useGetDailyLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyLog[]>({
    queryKey: ['dailyLogs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyLogs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveDailyLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: DailyLog) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveDailyLog(log);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLogs'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyLogs'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyAnalytics'] });
    },
  });
}

export function useGetWeeklyLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyLog[]>({
    queryKey: ['weeklyLogs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWeeklyLogs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetWeeklyAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeeklyAnalytics>({
    queryKey: ['weeklyAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWeeklyAnalytics();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetJournalEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JournalEntry[]>({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJournalEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveJournalEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyAnalytics'] });
    },
  });
}

export function useGetInterventions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Intervention[]>({
    queryKey: ['interventions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInterventions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveIntervention() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intervention: Intervention) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveIntervention(intervention);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyAnalytics'] });
    },
  });
}

export function useGetSafetyPlan() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SafetyPlan | null>({
    queryKey: ['safetyPlan'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSafetyPlan();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveSafetyPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: SafetyPlan) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveSafetyPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safetyPlan'] });
    },
  });
}

export function useGetModuleProgress(moduleId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ModuleProgress | null>({
    queryKey: ['moduleProgress', moduleId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getModuleProgress(moduleId);
    },
    enabled: !!actor && !actorFetching && !!moduleId,
  });
}

export function useGetAllModuleProgress() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ModuleProgress[]>({
    queryKey: ['allModuleProgress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllModuleProgress();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveModuleProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: ModuleProgress) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveModuleProgress(progress);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moduleProgress', variables.moduleId] });
      queryClient.invalidateQueries({ queryKey: ['allModuleProgress'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCheckoutSession(params.items, params.successUrl, params.cancelUrl);
      const session = JSON.parse(result) as { id: string; url: string };
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveSleepEstimatorRun() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (run: SleepEstimatorRun) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveSleepEstimatorRun(run);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleepEstimatorRuns'] });
      queryClient.invalidateQueries({ queryKey: ['sleepEstimatorRunCount'] });
    },
  });
}

export function useGetSleepEstimatorRuns(limit?: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SleepEstimatorRun[]>({
    queryKey: ['sleepEstimatorRuns', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSleepEstimatorRuns(limit ? BigInt(limit) : null);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSleepEstimatorRunCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['sleepEstimatorRunCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSleepEstimatorRunCount();
    },
    enabled: !!actor && !actorFetching,
  });
}
