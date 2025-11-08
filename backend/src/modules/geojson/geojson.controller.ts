import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { GeojsonService } from './geojson.service';
import { CreateGeojsonDto } from './dto/create-geojson.dto';
import { UpdateGeojsonDto } from './dto/update-geojson.dto';

@ApiTags('geojson')
@Controller('geojson')
export class GeojsonController {
  constructor(private readonly geojsonService: GeojsonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new GeoJSON network', description: 'Upload a new transportation network (biking or transit) for a city' })
  @ApiBody({ type: CreateGeojsonDto })
  @ApiResponse({ status: 201, description: 'Network created successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  create(@Body() createGeojsonDto: CreateGeojsonDto) {
    return this.geojsonService.create(createGeojsonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all GeoJSON networks', description: 'Retrieve list of all networks with optional filters' })
  @ApiQuery({ name: 'cityId', required: false, description: 'Filter by city ID' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by network type (biking/transit)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (draft/validated/active/archived)' })
  @ApiResponse({ status: 200, description: 'Networks retrieved successfully' })
  findAll(
    @Query('cityId') cityId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.geojsonService.findAll(cityId, type, status);
  }

  @Get('city/:cityId')
  @ApiOperation({ summary: 'Get networks by city', description: 'Retrieve all networks for a specific city' })
  @ApiParam({ name: 'cityId', description: 'City MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'Networks retrieved successfully' })
  findByCityId(@Param('cityId') cityId: string) {
    return this.geojsonService.findByCityId(cityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get network by ID', description: 'Retrieve a specific network by MongoDB ObjectID' })
  @ApiParam({ name: 'id', description: 'Network MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'Network found' })
  @ApiResponse({ status: 404, description: 'Network not found' })
  findOne(@Param('id') id: string) {
    return this.geojsonService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update network', description: 'Update network information by ID' })
  @ApiParam({ name: 'id', description: 'Network MongoDB ObjectID' })
  @ApiBody({ type: UpdateGeojsonDto })
  @ApiResponse({ status: 200, description: 'Network updated successfully' })
  @ApiResponse({ status: 404, description: 'Network not found' })
  update(@Param('id') id: string, @Body() updateGeojsonDto: UpdateGeojsonDto) {
    return this.geojsonService.update(id, updateGeojsonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete network', description: 'Delete a network by ID' })
  @ApiParam({ name: 'id', description: 'Network MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'Network deleted successfully' })
  @ApiResponse({ status: 404, description: 'Network not found' })
  remove(@Param('id') id: string) {
    return this.geojsonService.remove(id);
  }
}
