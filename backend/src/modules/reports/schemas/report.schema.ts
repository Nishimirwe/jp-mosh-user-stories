import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { City } from '../../cities/schemas/city.schema';
import { User } from '../../users/schemas/user.schema';
import { Simulation } from '../../simulations/schemas/simulation.schema';

export type ReportDocument = Report & Document;

export enum ReportType {
  SIMULATION_SUMMARY = 'simulation_summary',
  COMPARATIVE_ANALYSIS = 'comparative_analysis',
  ENVIRONMENTAL_IMPACT = 'environmental_impact',
  ACCESSIBILITY_ANALYSIS = 'accessibility_analysis',
  MODAL_SHIFT_ANALYSIS = 'modal_shift_analysis',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  HTML = 'html',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true })
  city: Types.ObjectId | City;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ReportType })
  type: ReportType;

  @Prop({ required: true, enum: ReportFormat })
  format: ReportFormat;

  @Prop({ required: true, enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  // Reference to simulation(s)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Simulation' }] })
  simulations: (Types.ObjectId | Simulation)[];

  // Storage key for generated report file
  @Prop()
  storageKey?: string;

  // File size in bytes
  @Prop()
  fileSize?: number;

  // Report configuration/template
  @Prop({ type: Object })
  configuration?: {
    // Template to use
    template?: string;

    // Sections to include
    sections?: string[]; // ['executive_summary', 'methodology', 'results', 'recommendations']

    // Visualization settings
    visualizations?: {
      includeCharts: boolean;
      includeMaps: boolean;
      chartTypes?: string[]; // ['bar', 'line', 'pie', 'heatmap']
      colorScheme?: string;
    };

    // Data filtering
    filters?: {
      dateRange?: {
        start: Date;
        end: Date;
      };
      tripStatuses?: string[]; // ['success', 'failed']
      minTravelTime?: number;
      maxTravelTime?: number;
    };

    // Custom parameters
    customParams?: Record<string, any>;
  };

  // Report data/content (for structured reports)
  @Prop({ type: Object })
  content?: {
    // Executive summary
    executiveSummary?: {
      keyFindings: string[];
      recommendations: string[];
      highlights: Array<{
        metric: string;
        value: string | number;
        change?: number; // percentage change
      }>;
    };

    // Tabular data
    tables?: Array<{
      title: string;
      headers: string[];
      rows: any[][];
      metadata?: {
        sortBy?: string;
        groupBy?: string;
      };
    }>;

    // Charts/visualizations metadata
    charts?: Array<{
      id: string;
      type: string; // 'bar', 'line', 'pie', 'scatter'
      title: string;
      data: any;
      options?: any;
    }>;

    // Maps metadata
    maps?: Array<{
      id: string;
      title: string;
      layers: string[]; // layer IDs
      bounds?: number[][]; // [[minLon, minLat], [maxLon, maxLat]]
      zoom?: number;
    }>;

    // Textual sections
    sections?: Array<{
      id: string;
      title: string;
      content: string; // HTML or markdown
      order: number;
    }>;

    // Comparison data (for comparative reports)
    comparisons?: Array<{
      scenarioA: {
        id: string;
        name: string;
        metrics: Record<string, number>;
      };
      scenarioB: {
        id: string;
        name: string;
        metrics: Record<string, number>;
      };
      differences: Record<string, number>;
    }>;

    // Custom content
    customContent?: Record<string, any>;
  };

  // Generation metadata
  @Prop({ type: Object })
  generationMetadata?: {
    generatedAt?: Date;
    generationTime?: number; // seconds
    generator?: string; // service/tool used
    version?: string;
    error?: string; // if generation failed
  };

  // User who requested the report
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User;

  // Share settings
  @Prop({ type: Object })
  shareSettings?: {
    isPublic: boolean;
    sharedWith: Array<{
      userId: Types.ObjectId;
      permission: string; // 'view', 'download'
    }>;
    shareLink?: string; // public shareable link
    expiresAt?: Date;
  };

  // Tags for organization
  @Prop({ type: [String], default: [] })
  tags: string[];

  // Is this report archived?
  @Prop({ default: false })
  archived: boolean;

  // Download tracking
  @Prop({ type: Object })
  analytics?: {
    viewCount: number;
    downloadCount: number;
    lastAccessedAt?: Date;
  };

  // Custom properties
  @Prop({ type: Object })
  customProperties?: Record<string, any>;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

// Indexes
ReportSchema.index({ city: 1, type: 1 });
ReportSchema.index({ city: 1, createdAt: -1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ createdBy: 1 });
ReportSchema.index({ simulations: 1 });
ReportSchema.index({ archived: 1 });
ReportSchema.index({ 'shareSettings.isPublic': 1 });
ReportSchema.index({ tags: 1 });
