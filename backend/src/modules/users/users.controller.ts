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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserCountResponseDto } from './dto/user-response.dto';
import { UserRole } from './schemas/user.schema';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user', description: 'Create a new user account in a specific city' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  @ApiResponse({ status: 403, description: 'Maximum users per city limit reached (20)' })
  @ApiResponse({ status: 404, description: 'City not found' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve list of all users with optional filters' })
  @ApiQuery({ name: 'cityId', required: false, description: 'Filter by city ID' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole, description: 'Filter by user role' })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status (true/false)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [UserResponseDto] })
  findAll(
    @Query('cityId') cityId?: string,
    @Query('role') role?: UserRole,
    @Query('active') active?: string,
  ) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.usersService.findAll(cityId, role, isActive);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email', description: 'Find a user by their email address' })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('city/:cityId')
  @ApiOperation({ summary: 'Get users by city', description: 'Retrieve all users belonging to a specific city' })
  @ApiParam({ name: 'cityId', description: 'City MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [UserResponseDto] })
  findByCityId(@Param('cityId') cityId: string) {
    return this.usersService.findByCityId(cityId);
  }

  @Get('city/:cityId/count')
  @ApiOperation({ summary: 'Count users by city', description: 'Get the number of users in a specific city' })
  @ApiParam({ name: 'cityId', description: 'City MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'Returns user count for the city', type: UserCountResponseDto })
  countByCityId(@Param('cityId') cityId: string) {
    return this.usersService.countByCityId(cityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user by their MongoDB ObjectID' })
  @ApiParam({ name: 'id', description: 'User MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user', description: 'Update user information by ID' })
  @ApiParam({ name: 'id', description: 'User MongoDB ObjectID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User MongoDB ObjectID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
