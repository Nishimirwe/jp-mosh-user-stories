import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateGeojsonDto } from './create-geojson.dto';

// Omit cityId from update (can't change city)
export class UpdateGeojsonDto extends PartialType(
  OmitType(CreateGeojsonDto, ['cityId'] as const)
) {}
