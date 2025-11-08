import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    description: 'MongoDB ObjectID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'City name',
    example: 'New York',
  })
  name: string;

  @ApiProperty({
    description: 'Unique URL-friendly identifier',
    example: 'new-york',
  })
  slug: string;

  @ApiProperty({
    description: 'Whether the city is active',
    example: true,
  })
  active: boolean;

  @ApiPropertyOptional({
    description: 'City description',
    example: 'Transportation planning for New York metropolitan area',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Country name',
    example: 'United States',
  })
  country?: string;

  @ApiPropertyOptional({
    description: 'IANA timezone identifier',
    example: 'America/New_York',
  })
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Additional custom metadata',
    example: { population: 8336817, area: 783.8 },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'City creation timestamp',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'City last update timestamp',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class CityCountResponseDto {
  @ApiProperty({
    description: 'Total number of cities',
    example: 42,
  })
  count: number;
}
