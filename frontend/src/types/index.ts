// User Types
export enum UserRole {
  ADMIN = 'ADMIN',
  PLANNER = 'PLANNER',
  VIEWER = 'VIEWER',
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  cityId: string;
  roles: UserRole[];
  active: boolean;
  lastLogin?: Date;
  metadata?: {
    department?: string;
    phone?: string;
    office?: string;
    [key: string]: any;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    cityId: string;
    roles: UserRole[];
  };
}

// City Types
export interface City {
  _id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  timezone: string;
  active: boolean;
  metadata?: {
    population?: number;
    area?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Network Types
export enum NetworkType {
  BIKING = 'BIKING',
  TRANSIT = 'TRANSIT',
}

export interface GeoJsonNetwork {
  _id: string;
  cityId: string;
  name: string;
  type: NetworkType;
  storageKey: string;
  geojson: any; // GeoJSON FeatureCollection
  isBaseline: boolean;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Simulation Types
export enum SimulationStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Simulation {
  _id: string;
  cityId: string;
  name: string;
  description?: string;
  baselineNetworkId: string;
  proposedNetworkId: string;
  status: SimulationStatus;
  createdBy: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Report Types
export interface Report {
  _id: string;
  simulationId: string;
  title: string;
  summary: string;
  metrics: {
    [key: string]: any;
  };
  visualizations?: any[];
  generatedBy: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}
