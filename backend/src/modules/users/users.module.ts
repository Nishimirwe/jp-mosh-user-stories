import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CitiesModule, // Import CitiesModule to use CitiesService
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export for use in Auth module
})
export class UsersModule {}
