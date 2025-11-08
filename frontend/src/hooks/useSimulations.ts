import { useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationsService } from '../services/simulations.service';
import type { CreateSimulationDto } from '../services/simulations.service';

/**
 * Create new simulation
 */
export function useCreateSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSimulationDto) => simulationsService.createSimulation(data),
    onSuccess: (newSimulation) => {
      // Invalidate and refetch simulations for this city
      queryClient.invalidateQueries({ queryKey: ['simulations', newSimulation.cityId] });
    },
  });
}

/**
 * Update simulation
 */
export function useUpdateSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      simulationsService.updateSimulation(id, data),
    onSuccess: (updatedSimulation) => {
      // Invalidate the simulations list
      queryClient.invalidateQueries({ queryKey: ['simulations', updatedSimulation.cityId] });
    },
  });
}

/**
 * Delete simulation
 */
export function useDeleteSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => simulationsService.deleteSimulation(id),
    onSuccess: () => {
      // Invalidate all simulation queries
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });
}
