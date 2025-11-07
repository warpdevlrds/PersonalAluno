import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Workout } from '@/types';

export function useWorkouts(userId?: string) {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('personalId', userId);
      
      if (error) throw error;
      return data as Workout[];
    },
    enabled: !!userId,
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workout: Partial<Workout>) => {
      const { data, error } = await supabase
        .from('workouts')
        .insert(workout)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}
