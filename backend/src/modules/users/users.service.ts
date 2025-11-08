import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CitiesService } from '../cities/cities.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private citiesService: CitiesService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verify city exists
    await this.citiesService.findOne(createUserDto.cityId);

    // Check user limit per city
    const maxUsersPerCity = Number(this.configService.get<number>('limits.maxUsersPerCity'));
    const cityUserCount = await this.userModel.countDocuments({
      city: createUserDto.cityId,
    });

    if (cityUserCount >= maxUsersPerCity) {
      throw new ForbiddenException(
        `Maximum number of users (${maxUsersPerCity}) reached for this city`,
      );
    }

    try {
      const newUser = new this.userModel({
        email: createUserDto.email,
        passwordHash: createUserDto.password, // Will be hashed by pre-save hook
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        city: createUserDto.cityId,
        roles: createUserDto.roles || [UserRole.VIEWER],
        metadata: createUserDto.metadata,
      });

      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`User with email '${createUserDto.email}' already exists`);
      }
      throw error;
    }
  }

  async findAll(cityId?: string, role?: UserRole, active?: boolean): Promise<{
    users: User[];
    total: number;
  }> {
    const query: any = {};

    if (cityId) {
      query.city = cityId;
    }

    if (role) {
      query.roles = role;
    }

    if (active !== undefined) {
      query.active = active;
    }

    const users = await this.userModel
      .find(query)
      .populate('city', 'name slug')
      .sort({ createdAt: -1 })
      .select('-passwordHash');

    const total = await this.userModel.countDocuments(query);

    return { users, total };
  }

  async findOne(id: string): Promise<User> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel
      .findById(id)
      .populate('city', 'name slug')
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).populate('city');
  }

  async findByCityId(cityId: string): Promise<User[]> {
    return this.userModel
      .find({ city: cityId })
      .populate('city', 'name slug')
      .select('-passwordHash');
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // If cityId is being updated, verify it exists
    if (updateUserDto.cityId) {
      await this.citiesService.findOne(updateUserDto.cityId);
    }

    // Don't allow password updates through this method
    const { password, ...updateData } = updateUserDto as any;

    const updatePayload: any = {};
    if (updateData.firstName) updatePayload.firstName = updateData.firstName;
    if (updateData.lastName) updatePayload.lastName = updateData.lastName;
    if (updateData.cityId) updatePayload.city = updateData.cityId;
    if (updateData.roles) updatePayload.roles = updateData.roles;
    if (updateData.active !== undefined) updatePayload.active = updateData.active;
    if (updateData.metadata) updatePayload.metadata = updateData.metadata;

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, { $set: updatePayload }, { new: true, runValidators: true })
        .populate('city', 'name slug')
        .select('-passwordHash');

      if (!updatedUser) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { lastLogin: new Date() },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return { message: `User '${result.email}' deleted successfully` };
  }

  async countByCityId(cityId: string): Promise<number> {
    return this.userModel.countDocuments({ city: cityId });
  }
}
