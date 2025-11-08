import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { City } from '../../cities/schemas/city.schema';
import { User } from '../../users/schemas/user.schema';
import { GeoJsonNetwork } from '../../geojson/schemas/geojson-network.schema';

export type SimulationDocument = Simulation & Document;

export enum SimulationStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum SimulationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Simulation {
  @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true })
  city: Types.ObjectId | City;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  // Reference to baseline network
  @Prop({ type: Types.ObjectId, ref: 'GeoJsonNetwork', required: true })
  baselineNetwork: Types.ObjectId | GeoJsonNetwork;

  // Reference to edited/proposed network (if comparing)
  @Prop({ type: Types.ObjectId, ref: 'GeoJsonNetwork' })
  proposedNetwork?: Types.ObjectId | GeoJsonNetwork;

  // Simulation parameters
  @Prop({ type: Object, required: true })
  parameters: {
    // RAPTOR algorithm parameters
    maxTransfers?: number;
    walkingSpeed?: number; // meters per second
    maxWalkingDistance?: number; // meters
    departureTimeStart?: string; // ISO time string
    departureTimeEnd?: string; // ISO time string
    timeStep?: number; // minutes between departure times

    // Origin-Destination matrix
    odMatrix?: {
      origins: Array<{
        id: string;
        coordinates: [number, number];
        demand?: number;
      }>;
      destinations: Array<{
        id: string;
        coordinates: [number, number];
      }>;
    };

    // Additional custom parameters
    customParams?: Record<string, any>;
  };

  // Simulation status
  @Prop({ required: true, enum: SimulationStatus, default: SimulationStatus.QUEUED })
  status: SimulationStatus;

  @Prop({ enum: SimulationPriority, default: SimulationPriority.NORMAL })
  priority: SimulationPriority;

  // Progress tracking (0-100)
  @Prop({ default: 0 })
  progress: number;

  // Queue information
  @Prop({ type: Object })
  queueInfo?: {
    jobId?: string; // BullMQ job ID
    queuedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    estimatedDuration?: number; // seconds
  };

  // Results storage
  @Prop()
  resultsStorageKey?: string; // S3/MinIO key for detailed results

  // Summary results (for quick access)
  @Prop({ type: Object })
  resultsSummary?: {
    totalTrips?: number;
    successfulTrips?: number;
    failedTrips?: number;
    averageTravelTime?: number; // seconds
    averageTransfers?: number;
    totalCO2Reduction?: number; // kg
    modalShiftPercentage?: number; // percentage of trips shifted
    executionTime?: number; // seconds
  };

  // Error information (if failed)
  @Prop({ type: Object })
  error?: {
    message?: string;
    stack?: string;
    timestamp?: Date;
  };

  // User who created the simulation
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User;

  // Tags for categorization
  @Prop({ type: [String], default: [] })
  tags: string[];

  // Is this simulation archived?
  @Prop({ default: false })
  archived: boolean;

  // Additional metadata
  @Prop({ type: Object })
  metadata?: {
    version?: string; // Algorithm version used
    environment?: string; // dev, staging, production
    computeResources?: {
      cpu?: string;
      memory?: string;
      executionNode?: string;
    };
  };

  // Custom properties
  @Prop({ type: Object })
  customProperties?: Record<string, any>;
}

export const SimulationSchema = SchemaFactory.createForClass(Simulation);

// Indexes
SimulationSchema.index({ city: 1, status: 1 });
SimulationSchema.index({ city: 1, createdAt: -1 });
SimulationSchema.index({ status: 1, priority: -1, createdAt: 1 }); // For queue processing
SimulationSchema.index({ createdBy: 1 });
SimulationSchema.index({ baselineNetwork: 1 });
SimulationSchema.index({ proposedNetwork: 1 });
SimulationSchema.index({ archived: 1 });
