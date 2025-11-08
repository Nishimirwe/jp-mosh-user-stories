import { api } from '../lib/axios';
import type { GeoJsonNetwork } from '../types';

export interface CreateNetworkDto {
  cityId: string;
  name: string;
  type: 'BIKING' | 'TRANSIT';
  storageKey: string;
  geojson: any; // GeoJSON FeatureCollection
  isBaseline: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateNetworkDto {
  name?: string;
  type?: 'BIKING' | 'TRANSIT';
  geojson?: any;
  isBaseline?: boolean;
  metadata?: Record<string, any>;
}

export const networksService = {
  /**
   * Get all networks for a city
   */
  async getAllNetworks(cityId: string): Promise<GeoJsonNetwork[]> {
    const response = await api.get<GeoJsonNetwork[]>('/geojson', {
      params: { cityId },
    });
    return response.data;
  },

  /**
   * Get network by ID
   */
  async getNetworkById(id: string): Promise<GeoJsonNetwork> {
    const response = await api.get<GeoJsonNetwork>(`/geojson/${id}`);
    return response.data;
  },

  /**
   * Get networks by city
   */
  async getNetworksByCity(cityId: string): Promise<GeoJsonNetwork[]> {
    const response = await api.get<GeoJsonNetwork[]>(`/geojson/city/${cityId}`);
    return response.data;
  },

  /**
   * Create new network
   */
  async createNetwork(data: CreateNetworkDto): Promise<GeoJsonNetwork> {
    const response = await api.post<GeoJsonNetwork>('/geojson', data);
    return response.data;
  },

  /**
   * Update network
   */
  async updateNetwork(id: string, data: UpdateNetworkDto): Promise<GeoJsonNetwork> {
    const response = await api.patch<GeoJsonNetwork>(`/geojson/${id}`, data);
    return response.data;
  },

  /**
   * Delete network
   */
  async deleteNetwork(id: string): Promise<void> {
    await api.delete(`/geojson/${id}`);
  },
};
