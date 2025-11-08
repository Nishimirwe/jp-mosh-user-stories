import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Simulation } from './simulation.schema';

export type SimulationResultDocument = SimulationResult & Document;

export enum TripStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

@Schema({ timestamps: true })
export class SimulationResult {
  // Reference to the simulation
  @Prop({ type: Types.ObjectId, ref: 'Simulation', required: true, index: true })
  simulation: Types.ObjectId | Simulation;

  // Storage key for full results file (GeoJSON, CSV, etc.)
  @Prop({ required: true })
  storageKey: string;

  // File format
  @Prop({ required: true })
  format: string; // 'geojson', 'csv', 'json'

  // File size in bytes
  @Prop()
  fileSize?: number;

  // Detailed trip results (for smaller datasets, otherwise store in S3)
  @Prop({ type: [Object] })
  trips?: Array<{
    tripId: string;
    originId: string;
    destinationId: string;
    status: TripStatus;

    // Route information
    route?: {
      totalDuration: number; // seconds
      totalDistance: number; // meters
      transfers: number;
      legs: Array<{
        mode: string; // 'walk', 'transit', 'bike'
        duration: number; // seconds
        distance: number; // meters
        routeId?: string; // For transit legs
        routeName?: string;
        departureTime?: string; // ISO string
        arrivalTime?: string; // ISO string
        geometry?: any; // GeoJSON LineString
      }>;
    };

    // Comparison with baseline (if applicable)
    baseline?: {
      totalDuration: number;
      totalDistance: number;
      transfers: number;
      co2Emissions: number; // kg
    };

    // Improvement metrics
    improvement?: {
      timeSaved: number; // seconds
      distanceReduction: number; // meters
      co2Reduction: number; // kg
      transfersReduction: number;
    };

    // Error information (if failed)
    error?: string;
  }>;

  // Aggregated statistics
  @Prop({ type: Object, required: true })
  statistics: {
    // Overall metrics
    totalTrips: number;
    successfulTrips: number;
    failedTrips: number;
    partialTrips: number;

    // Travel time statistics
    averageTravelTime: number; // seconds
    medianTravelTime: number;
    minTravelTime: number;
    maxTravelTime: number;
    totalTravelTime: number; // total person-seconds

    // Transfer statistics
    averageTransfers: number;
    maxTransfers: number;
    tripsWithNoTransfers: number;
    tripsWithOneTransfer: number;
    tripsWithMultipleTransfers: number;

    // Distance statistics
    averageDistance: number; // meters
    totalDistance: number; // total person-meters

    // Modal split
    modalSplit: {
      walkOnly: number; // number of trips
      transitOnly: number;
      bikeOnly: number;
      multimodal: number;
    };

    // Environmental impact
    totalCO2Reduction: number; // kg
    averageCO2ReductionPerTrip: number;

    // Accessibility metrics
    destinationsReachable: number; // count
    destinationsUnreachable: number;
    averageAccessibilityScore?: number; // 0-100
  };

  // Geospatial results (for mapping)
  @Prop({ type: Object })
  geospatialData?: {
    // Heatmap of accessibility improvements
    accessibilityGrid?: {
      type: string; // 'FeatureCollection'
      features: any[]; // GeoJSON features with accessibility scores
    };

    // Most used routes/corridors
    corridorUsage?: {
      type: string; // 'FeatureCollection'
      features: any[]; // GeoJSON LineStrings with usage counts
    };
  };

  // Temporal analysis (if multiple departure times)
  @Prop({ type: [Object] })
  temporalAnalysis?: Array<{
    departureTime: string; // ISO time string
    averageTravelTime: number;
    successRate: number; // percentage
    congestionLevel?: number; // 0-100
  }>;

  // Comparison with baseline scenario (if applicable)
  @Prop({ type: Object })
  baselineComparison?: {
    overallImprovement: number; // percentage
    timeSavingsTotal: number; // total seconds saved across all trips
    co2ReductionTotal: number; // total kg CO2 reduced
    accessibilityImprovement: number; // percentage
    modalShiftPercentage: number; // percentage of trips using new infrastructure
  };

  // Data quality metrics
  @Prop({ type: Object })
  qualityMetrics?: {
    completeness: number; // percentage
    missingData: string[]; // list of missing fields
    anomalies: string[]; // detected anomalies
    confidence: number; // 0-100
  };

  // Processing metadata
  @Prop({ type: Object })
  processingMetadata?: {
    algorithmVersion: string;
    computeTime: number; // seconds
    memoryUsed: number; // MB
    processingNode: string;
    timestamp: Date;
  };

  // Custom result properties
  @Prop({ type: Object })
  customProperties?: Record<string, any>;
}

export const SimulationResultSchema = SchemaFactory.createForClass(SimulationResult);

// Indexes
SimulationResultSchema.index({ simulation: 1 });
SimulationResultSchema.index({ createdAt: -1 });
SimulationResultSchema.index({ format: 1 });

// 2dsphere index for geospatial queries on accessibility grid and corridor usage
SimulationResultSchema.index({ 'geospatialData.accessibilityGrid': '2dsphere' });
SimulationResultSchema.index({ 'geospatialData.corridorUsage': '2dsphere' });
