import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from './schemas/city.schema';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    try {
      const createdCity = new this.cityModel(createCityDto);
      return await createdCity.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `City with slug '${createCityDto.slug}' already exists`,
        );
      }
      throw error;
    }
  }

  async findAll(
    active?: boolean,
    search?: string,
  ): Promise<{ cities: City[]; total: number }> {
    const query: any = {};

    if (active !== undefined) {
      query.active = active;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const cities = await this.cityModel.find(query).sort({ createdAt: -1 });
    const total = await this.cityModel.countDocuments(query);

    return { cities, total };
  }

  async findOne(id: string): Promise<City> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid city ID format');
    }

    const city = await this.cityModel.findById(id);

    if (!city) {
      throw new NotFoundException(`City with ID '${id}' not found`);
    }

    return city;
  }

  async findBySlug(slug: string): Promise<City> {
    const city = await this.cityModel.findOne({ slug });

    if (!city) {
      throw new NotFoundException(`City with slug '${slug}' not found`);
    }

    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid city ID format');
    }

    try {
      const updatedCity = await this.cityModel.findByIdAndUpdate(
        id,
        { $set: updateCityDto },
        { new: true, runValidators: true },
      );

      if (!updatedCity) {
        throw new NotFoundException(`City with ID '${id}' not found`);
      }

      return updatedCity;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `City with slug '${updateCityDto.slug}' already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid city ID format');
    }

    const result = await this.cityModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`City with ID '${id}' not found`);
    }

    return { message: `City '${result.name}' deleted successfully` };
  }

  async count(): Promise<number> {
    return this.cityModel.countDocuments();
  }
}
