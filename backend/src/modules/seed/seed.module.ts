import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CitiesModule } from '../cities/cities.module';
import { UsersModule } from '../users/users.module';
import { GeojsonModule } from '../geojson/geojson.module';

@Module({
  imports: [CitiesModule, UsersModule, GeojsonModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
