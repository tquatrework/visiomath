import { 
  Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe, UseGuards, NotFoundException 
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { StudentProfileService } from './studentProfile.service.js';
import { StudentProfile } from '../../shared/entities/studentProfile.entity.js';

@ApiTags('Student Profiles')
@UseGuards(JwtAuthGuard)
@Controller('student-profiles')
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  /**
   * Retrieve all student profiles with optional filters.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all student profiles' })
  @ApiQuery({ name: 'profileId', description: 'Filter by UserProfileId', required: false })
  @ApiResponse({ status: 200, description: 'List of student profiles retrieved successfully.', type: [StudentProfile] })
  async findAll(@Query('profileId') profileId?: string): Promise<StudentProfile[]> {
    if (profileId) {
      const studentProfile = await this.studentProfileService.findByUserProfileId(parseInt(profileId));
      if (!studentProfile) {
        throw new NotFoundException('Student profile not found.');
      }
      return [studentProfile];
    }
    return this.studentProfileService.findAll();
  }

  /**
   * Retrieve a specific student profile by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific student profile by ID' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiResponse({ status: 200, description: 'Student profile retrieved successfully.', type: StudentProfile })
  @ApiResponse({ status: 404, description: 'Student profile not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StudentProfile> {
    return this.studentProfileService.findOne(id);
  }

  /**
   * Create a new student profile.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new student profile' })
  @ApiBody({ description: 'Student profile data', type: StudentProfile })
  @ApiResponse({ status: 201, description: 'Student profile created successfully.', type: StudentProfile })
  async create(@Body() studentProfileData: Partial<StudentProfile>): Promise<StudentProfile> {
    return this.studentProfileService.create(studentProfileData);
  }

  /**
   * Update an existing student profile by ID.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing student profile by ID' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiBody({ description: 'Updated data for student profile', type: StudentProfile })
  @ApiResponse({ status: 200, description: 'Student profile updated successfully.', type: StudentProfile })
  @ApiResponse({ status: 404, description: 'Student profile not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() studentProfileData: Partial<StudentProfile>,
  ): Promise<StudentProfile> {
    return this.studentProfileService.update(id, studentProfileData);
  }

  /**
   * Delete a student profile by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student profile by ID' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiResponse({ status: 204, description: 'Student profile deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Student profile not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.studentProfileService.remove(id);
  }
}
