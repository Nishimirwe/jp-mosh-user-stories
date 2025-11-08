import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './modules/cities/cities.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GeojsonModule } from './modules/geojson/geojson.module';
import { SimulationsModule } from './modules/simulations/simulations.module';
import { ReportsModule } from './modules/reports/reports.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Config Module - loads environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    // MongoDB Module - connects to MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),

    CitiesModule,

    UsersModule,

    AuthModule,

    GeojsonModule,

    SimulationsModule,

    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
