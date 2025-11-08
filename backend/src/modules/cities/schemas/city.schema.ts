import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CityDocument = City & Document;

@Schema({ timestamps: true })
export class City {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  description?: string;

  @Prop()
  country?: string;

  @Prop()
  timezone?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const CitySchema = SchemaFactory.createForClass(City);

// Create indexes
CitySchema.index({ slug: 1 }, { unique: true });
CitySchema.index({ active: 1 });
CitySchema.index({ name: 'text' }); // Text search on name
