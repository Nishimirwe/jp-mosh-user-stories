import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { City } from '../../cities/schemas/city.schema';
import { User } from '../../users/schemas/user.schema';

export type GeoJsonNetworkDocument = GeoJsonNetwork & Document;

export enum NetworkType {
  BIKING = 'biking',
  TRANSIT = 'transit',
}

export enum NetworkStatus {
  DRAFT = 'draft',
  VALIDATED = 'validated',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class GeoJsonNetwork {
  @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true })
  city: Types.ObjectId | City;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true, enum: NetworkType })
  type: NetworkType;

  @Prop({ required: true, enum: NetworkStatus, default: NetworkStatus.DRAFT })
  status: NetworkStatus;

  // Storage key in S3/MinIO
  @Prop({ required: true })
  storageKey: string;

  // Actual GeoJSON data (for smaller files, or store in S3 for large files)
  @Prop({ type: Object })
  geojson?: any;

  // Metadata about the GeoJSON
  @Prop({ type: Object })
  metadata: {
    featureCount?: number;
    bounds?: {
      type: string;
      coordinates: number[][][];
    };
    crs?: string;
    fileSize?: number;
    uploadedAt?: Date;
  };

  // Validation results
  @Prop({ type: Object })
  validation?: {
    isValid: boolean;
    errors?: string[];
    warnings?: string[];
    validatedAt?: Date;
  };

  // Version control
  @Prop({ default: 1 })
  version: number;

  @Prop({ type: Types.ObjectId, ref: 'GeoJsonNetwork' })
  parentVersion?: Types.ObjectId | GeoJsonNetwork;

  // User who uploaded/created this network
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User;

  // User who last modified
  @Prop({ type: Types.ObjectId, ref: 'User' })
  lastModifiedBy?: Types.ObjectId | User;

  // Tags for categorization
  @Prop({ type: [String], default: [] })
  tags: string[];

  // Is this the baseline network for simulations?
  @Prop({ default: false })
  isBaseline: boolean;

  // Additional custom properties
  @Prop({ type: Object })
  customProperties?: Record<string, any>;
}

export const GeoJsonNetworkSchema = SchemaFactory.createForClass(GeoJsonNetwork);

// Indexes
GeoJsonNetworkSchema.index({ city: 1, type: 1 });
GeoJsonNetworkSchema.index({ city: 1, isBaseline: 1 });
GeoJsonNetworkSchema.index({ status: 1 });
GeoJsonNetworkSchema.index({ createdAt: -1 });

// 2dsphere index for geospatial queries on the GeoJSON data
GeoJsonNetworkSchema.index({ 'geojson': '2dsphere' });
