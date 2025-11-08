import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed database with test data' })
  @ApiResponse({
    status: 201,
    description: 'Database seeded successfully',
    schema: {
      type: 'object',
      properties: {
        cities: { type: 'number', example: 5 },
        users: { type: 'number', example: 11 },
        networks: { type: 'number', example: 9 },
        message: { type: 'string', example: 'Database seeded successfully with rich test data!' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async seedDatabase() {
    return await this.seedService.seedAll();
  }
}
