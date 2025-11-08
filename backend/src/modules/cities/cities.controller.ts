import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new city', description: 'Create a new city/workspace for transportation planning' })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  @ApiResponse({ status: 409, description: 'City with this slug already exists' })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cities', description: 'Retrieve list of all cities with optional filters' })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status (true/false)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search cities by name or description' })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  findAll(
    @Query('active') active?: string,
    @Query('search') search?: string,
  ) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.citiesService.findAll(isActive, search);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get city by slug', description: 'Retrieve a city by its unique slug identifier' })
  @ApiParam({ name: 'slug', description: 'City slug (e.g., "new-york")' })
  @ApiResponse({ status: 200, description: 'City found' })
  @ApiResponse({ status: 404, description: 'City not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.citiesService.findBySlug(slug);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get city count', description: 'Get total number of cities' })
  @ApiResponse({ status: 200, description: 'Returns city count' })
  count() {
    return this.citiesService.count();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by ID', description: 'Retrieve a specific city by MongoDB ObjectID' })
  @ApiParam({ name: 'id', description: 'City MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'City found' })
  @ApiResponse({ status: 404, description: 'City not found' })
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update city', description: 'Update city information by ID' })
  @ApiParam({ name: 'id', description: 'City MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete city', description: 'Delete a city by ID' })
  @ApiParam({ name: 'id', description: 'City MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
