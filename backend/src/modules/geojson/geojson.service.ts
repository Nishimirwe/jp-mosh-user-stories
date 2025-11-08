import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGeojsonDto } from './dto/create-geojson.dto';
import { UpdateGeojsonDto } from './dto/update-geojson.dto';
import { GeoJsonNetwork, NetworkStatus } from './schemas/geojson-network.schema';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class GeojsonService {
  constructor(
    @InjectModel(GeoJsonNetwork.name) private networkModel: Model<GeoJsonNetwork>,
    private citiesService: CitiesService,
  ) {}

  async create(createGeojsonDto: CreateGeojsonDto): Promise<GeoJsonNetwork> {
    // Verify city exists
    await this.citiesService.findOne(createGeojsonDto.cityId);

    const network = new this.networkModel({
      city: createGeojsonDto.cityId,
      name: createGeojsonDto.name,
      type: createGeojsonDto.type,
      storageKey: createGeojsonDto.storageKey,
      geojson: createGeojsonDto.geojson,
      metadata: createGeojsonDto.metadata,
      isBaseline: createGeojsonDto.isBaseline || false,
      status: NetworkStatus.DRAFT,
      version: 1,
    });

    return network.save();
  }

  async findAll(cityId?: string, type?: string, status?: string): Promise<GeoJsonNetwork[]> {
    const filter: any = {};
    if (cityId) filter.city = cityId;
    if (type) filter.type = type;
    if (status) filter.status = status;

    return this.networkModel
      .find(filter)
      .populate('city', 'name slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<GeoJsonNetwork> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid network ID format');
    }

    const network = await this.networkModel
      .findById(id)
      .populate('city', 'name slug')
      .exec();

    if (!network) {
      throw new NotFoundException(`Network with ID '${id}' not found`);
    }

    return network;
  }

  async findByCityId(cityId: string): Promise<GeoJsonNetwork[]> {
    return this.networkModel
      .find({ city: cityId })
      .populate('city', 'name slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateGeojsonDto: UpdateGeojsonDto): Promise<GeoJsonNetwork> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid network ID format');
    }

    const network = await this.networkModel
      .findByIdAndUpdate(id, { $set: updateGeojsonDto }, { new: true, runValidators: true })
      .populate('city', 'name slug')
      .exec();

    if (!network) {
      throw new NotFoundException(`Network with ID '${id}' not found`);
    }

    return network;
  }

  async updateStatus(id: string, status: NetworkStatus): Promise<GeoJsonNetwork> {
    return this.update(id, { status } as any);
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid network ID format');
    }

    const result = await this.networkModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`Network with ID '${id}' not found`);
    }

    return { message: `Network '${result.name}' deleted successfully` };
  }
}
