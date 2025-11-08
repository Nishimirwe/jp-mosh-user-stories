import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class UserResponseDto {
  @ApiProperty({
    description: 'MongoDB ObjectID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'City this user belongs to',
    example: { id: '507f1f77bcf86cd799439011', name: 'New York', slug: 'new-york' },
  })
  city: any;

  @ApiProperty({
    description: 'User roles',
    enum: UserRole,
    isArray: true,
    example: [UserRole.PLANNER],
  })
  roles: UserRole[];

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  active: boolean;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
    example: '2025-01-15T10:30:00.000Z',
  })
  lastLogin?: Date;

  @ApiPropertyOptional({
    description: 'Additional custom metadata',
    example: { department: 'Transportation Planning', phone: '+1234567890' },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class UserCountResponseDto {
  @ApiProperty({
    description: 'Total number of users',
    example: 15,
  })
  count: number;
}
