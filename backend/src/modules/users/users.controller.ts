import { 
  Controller, Get, Post, Put, Patch, Delete, Param, Query, Body, UseGuards, Req 
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { AuthService } from '../auth/auth.service.js';
import { User } from '../../shared/entities/user.entity.js';
import { CreateUserDto } from '../../shared/dto/create-user.dto.js';
import { UpdateUserDto } from '../../shared/dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  /**
   * Retrieve current user's basic information.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Retrieve current user information' })
  @ApiResponse({ status: 200, description: 'Current user information retrieved successfully' })
  async getMe(@Req() req: Request) {
    return req.user;
  }

  /**
   * Retrieve user by ID.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  /**
   * Retrieve user by Pseudo.
   */
  @UseGuards(JwtAuthGuard)
  @Get('pseudo/:pseudo')
  @ApiOperation({ summary: 'Retrieve user by pseudo' })
  @ApiParam({ name: 'pseudo', description: 'User pseudo', required: true })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  async findByPseudo(@Param('pseudo') pseudo: string): Promise<User | undefined> {
    return this.usersService.findByPseudo(pseudo);
  }

  /**
   * Retrieve user by Email.
   */
  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  @ApiOperation({ summary: 'Retrieve user by email' })
  @ApiParam({ name: 'email', description: 'User email', required: true })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  async findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  /**
   * Retrieve users by roles.
   */
  // @UseGuards(JwtAuthGuard)
  @UseGuards(OptionalAuthGuard)
  @Get('roles/:roles')
  @ApiOperation({ summary: 'Retrieve users by roles' })
  @ApiParam({ name: 'roles', description: 'Comma-separated list of roles', required: true })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [User] })
  async findByRoles(@Param('roles') roles: string): Promise<User[]> {
    const roleList = roles.split(',');
    return this.usersService.findByRoles(roleList);
  }

  /**
   * Create a new user.
   */
  //@UseGuards()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
    const user = await this.usersService.create(createUserDto);
    const token = await this.authService.generateToken(user);
    return { user, token };
  }

  /**
   * Update an existing user.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user by ID.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.usersService.delete(id);
  }
}
