import { 
  Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe, UseGuards, NotFoundException 
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeacherOrdonnanceService } from './teacherOrdonnance.service';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity';

@ApiTags('Teacher Ordonnances')
@UseGuards(JwtAuthGuard)
@Controller('teacher-ordonnances')
export class TeacherOrdonnanceController {
  constructor(private readonly teacherOrdonnanceService: TeacherOrdonnanceService) {}

  /**
   * Retrieve all teacher ordonnances with optional filters.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all teacher ordonnances' })
  @ApiQuery({ name: 'profileId', description: 'Filter by UserProfileId', required: false })
  @ApiResponse({ status: 200, description: 'List of teacher ordonnances retrieved successfully.', type: [TeacherOrdonnance] })
  async findAll(@Query('profileId') profileId?: string): Promise<TeacherOrdonnance[]> {
    if (profileId) {
      const teacherOrdonnance = await this.teacherOrdonnanceService.findByProfileId(parseInt(profileId));
      if (!teacherOrdonnance) {
        throw new NotFoundException('Teacher ordonnance not found.');
      }
      return [teacherOrdonnance];
    }
    return this.teacherOrdonnanceService.findAll();
  }

  /**
   * Retrieve a specific teacher ordonnance by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific teacher ordonnance by ID' })
  @ApiParam({ name: 'id', description: 'Teacher Ordonnance ID' })
  @ApiResponse({ status: 200, description: 'Teacher ordonnance retrieved successfully.', type: TeacherOrdonnance })
  @ApiResponse({ status: 404, description: 'Teacher ordonnance not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TeacherOrdonnance> {
    return this.teacherOrdonnanceService.findOne(id);
  }

  /**
   * Create a new teacher ordonnance.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new teacher ordonnance' })
  @ApiBody({ description: 'Teacher ordonnance data', type: TeacherOrdonnance })
  @ApiResponse({ status: 201, description: 'Teacher ordonnance created successfully.', type: TeacherOrdonnance })
  async create(@Body() data: Partial<TeacherOrdonnance>): Promise<TeacherOrdonnance> {
    return this.teacherOrdonnanceService.create(data);
  }

  /**
   * Update an existing teacher ordonnance by ID.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing teacher ordonnance by ID' })
  @ApiParam({ name: 'id', description: 'Teacher Ordonnance ID' })
  @ApiBody({ description: 'Updated data for teacher ordonnance', type: TeacherOrdonnance })
  @ApiResponse({ status: 200, description: 'Teacher ordonnance updated successfully.', type: TeacherOrdonnance })
  @ApiResponse({ status: 404, description: 'Teacher ordonnance not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<TeacherOrdonnance>,
  ): Promise<TeacherOrdonnance> {
    return this.teacherOrdonnanceService.update(id, data);
  }

  /**
   * Delete a teacher ordonnance by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher ordonnance by ID' })
  @ApiParam({ name: 'id', description: 'Teacher Ordonnance ID' })
  @ApiResponse({ status: 204, description: 'Teacher ordonnance deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Teacher ordonnance not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teacherOrdonnanceService.delete(id);
  }
}
