import { 
  Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe, UseGuards, NotFoundException 
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeacherProfileService } from './teacherProfile.service';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity';

@ApiTags('Teacher Profiles')
@UseGuards(JwtAuthGuard)
@Controller('teacher-profiles')
export class TeacherProfileController {
  constructor(private readonly teacherProfileService: TeacherProfileService) {}

  /**
   * Retrieve all teacher profiles with optional filters.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all teacher profiles' })
  @ApiQuery({ name: 'profileId', description: 'Filter by UserProfileId', required: false })
  @ApiResponse({ status: 200, description: 'List of teacher profiles retrieved successfully.', type: [TeacherProfile] })
  async findAll(@Query('profileId') profileId?: string): Promise<TeacherProfile[]> {
    if (profileId) {
      const teacherProfile = await this.teacherProfileService.findByProfileId(parseInt(profileId));
      if (!teacherProfile) {
        throw new NotFoundException('Teacher profile not found.');
      }
      return [teacherProfile];
    }
    return this.teacherProfileService.findAll();
  }

  /**
   * Retrieve a specific teacher profile by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific teacher profile by ID' })
  @ApiParam({ name: 'id', description: 'Teacher Profile ID' })
  @ApiResponse({ status: 200, description: 'Teacher profile retrieved successfully.', type: TeacherProfile })
  @ApiResponse({ status: 404, description: 'Teacher profile not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TeacherProfile> {
    return this.teacherProfileService.findOne(id);
  }

  /**
   * Create a new teacher profile.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new teacher profile' })
  @ApiBody({ description: 'Teacher profile data', type: TeacherProfile })
  @ApiResponse({ status: 201, description: 'Teacher profile created successfully.', type: TeacherProfile })
  async create(@Body() data: Partial<TeacherProfile>): Promise<TeacherProfile> {
    return this.teacherProfileService.create(data);
  }

  /**
   * Update an existing teacher profile by ID.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing teacher profile by ID' })
  @ApiParam({ name: 'id', description: 'Teacher Profile ID' })
  @ApiBody({ description: 'Updated data for teacher profile', type: TeacherProfile })
  @ApiResponse({ status: 200, description: 'Teacher profile updated successfully.', type: TeacherProfile })
  @ApiResponse({ status: 404, description: 'Teacher profile not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<TeacherProfile>,
  ): Promise<TeacherProfile> {
    return this.teacherProfileService.update(id, data);
  }

  /**
   * Delete a teacher profile by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher profile by ID' })
  @ApiParam({ name: 'id', description: 'Teacher Profile ID' })
  @ApiResponse({ status: 204, description: 'Teacher profile deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Teacher profile not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teacherProfileService.delete(id);
  }
}
