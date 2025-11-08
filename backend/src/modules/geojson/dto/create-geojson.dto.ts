import { IsString, IsEnum, IsOptional, IsObject, IsBoolean, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NetworkType {
  BIKING = 'biking',
  TRANSIT = 'transit',
}

export class CreateGeojsonDto {
  @ApiProperty({
    description: 'City MongoDB ObjectID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  cityId: string;

  @ApiProperty({
    description: 'Network name',
    example: 'Downtown Bike Lanes 2025',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Network type',
    enum: NetworkType,
    example: NetworkType.BIKING,
  })
  @IsEnum(NetworkType)
  type: NetworkType;

  @ApiProperty({
    description: 'Storage key for S3/MinIO',
    example: 'networks/new-york/biking-2025-01.geojson',
  })
  @IsString()
  storageKey: string;

  @ApiPropertyOptional({
    description: 'GeoJSON data (optional, can be uploaded separately)',
    example: { type: 'FeatureCollection', features: [] },
  })
  @IsOptional()
  @IsObject()
  geojson?: any;

  @ApiPropertyOptional({
    description: 'Network metadata',
    example: { featureCount: 150, fileSize: 2048000 },
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    featureCount?: number;
    bounds?: any;
    crs?: string;
    fileSize?: number;
  };

  @ApiPropertyOptional({
    description: 'Is this the baseline network?',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isBaseline?: boolean;
}
