import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    description: 'MongoDB ObjectID of the city this user belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  cityId: string;

  @ApiPropertyOptional({
    description: 'User roles',
    enum: UserRole,
    isArray: true,
    example: [UserRole.PLANNER],
    default: [UserRole.VIEWER],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];

  @ApiPropertyOptional({
    description: 'Additional custom metadata',
    example: { department: 'Transportation Planning', phone: '+1234567890' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
