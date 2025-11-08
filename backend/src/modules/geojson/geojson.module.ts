import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeojsonService } from './geojson.service';
import { GeojsonController } from './geojson.controller';
import { GeoJsonNetwork, GeoJsonNetworkSchema } from './schemas/geojson-network.schema';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeoJsonNetwork.name, schema: GeoJsonNetworkSchema },
    ]),
    CitiesModule,
  ],
  controllers: [GeojsonController],
  providers: [GeojsonService],
  exports: [GeojsonService],
})
export class GeojsonModule {}
