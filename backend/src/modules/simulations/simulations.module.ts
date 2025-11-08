import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimulationsService } from './simulations.service';
import { SimulationsController } from './simulations.controller';
import { Simulation, SimulationSchema } from './schemas/simulation.schema';
import { SimulationResult, SimulationResultSchema } from './schemas/simulation-result.schema';
import { CitiesModule } from '../cities/cities.module';
import { GeojsonModule } from '../geojson/geojson.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Simulation.name, schema: SimulationSchema },
      { name: SimulationResult.name, schema: SimulationResultSchema },
    ]),
    CitiesModule,
    GeojsonModule,
  ],
  controllers: [SimulationsController],
  providers: [SimulationsService],
  exports: [SimulationsService],
})
export class SimulationsModule {}
