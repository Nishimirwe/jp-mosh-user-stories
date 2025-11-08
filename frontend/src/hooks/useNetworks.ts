import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { networksService } from '../services/networks.service';
import type { CreateNetworkDto, UpdateNetworkDto } from '../services/networks.service';
import type { GeoJsonNetwork } from '../types';

/**
 * Get all networks for a city
 */
export function useNetworks(cityId: string) {
  return useQuery({
    queryKey: ['networks', cityId],
    queryFn: () => networksService.getAllNetworks(cityId),
    enabled: !!cityId,
  });
}

/**
 * Get single network by ID
 */
export function useNetwork(id: string) {
  return useQuery({
    queryKey: ['network', id],
    queryFn: () => networksService.getNetworkById(id),
    enabled: !!id,
  });
}

/**
 * Create new network
 */
export function useCreateNetwork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNetworkDto) => networksService.createNetwork(data),
    onSuccess: (newNetwork) => {
      // Invalidate and refetch networks for this city
      queryClient.invalidateQueries({ queryKey: ['networks', newNetwork.cityId] });
    },
  });
}

/**
 * Update network
 */
export function useUpdateNetwork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNetworkDto }) =>
      networksService.updateNetwork(id, data),
    onSuccess: (updatedNetwork) => {
      // Update the cache for this specific network
      queryClient.setQueryData(['network', updatedNetwork._id], updatedNetwork);
      // Invalidate the networks list
      queryClient.invalidateQueries({ queryKey: ['networks', updatedNetwork.cityId] });
    },
  });
}

/**
 * Delete network
 */
export function useDeleteNetwork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => networksService.deleteNetwork(id),
    onSuccess: (_, id) => {
      // Invalidate all network queries
      queryClient.invalidateQueries({ queryKey: ['networks'] });
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['network', id] });
    },
  });
}
