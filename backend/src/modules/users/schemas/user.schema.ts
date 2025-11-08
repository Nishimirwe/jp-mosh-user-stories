import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { City } from '../../cities/schemas/city.schema';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  PLANNER = 'planner',
  VIEWER = 'viewer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true })
  city: Types.ObjectId | City;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.VIEWER] })
  roles: UserRole[];

  @Prop({ default: true })
  active: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ city: 1 });
UserSchema.index({ roles: 1 });
UserSchema.index({ active: 1 });

// Virtual fields
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove password from JSON responses
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    const { passwordHash, ...rest } = ret;
    return rest;
  },
});
