import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/swagger';

// Omit password and cityId from update (password has separate endpoint, cityId shouldn't change)
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'cityId'] as const)
) {}
