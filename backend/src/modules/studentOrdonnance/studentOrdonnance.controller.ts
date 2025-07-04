import { 
  Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe, UseGuards, NotFoundException 
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudentOrdonnanceService } from './studentOrdonnance.service';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity';

@ApiTags('Student Ordonnances')
@UseGuards(JwtAuthGuard)
@Controller('student-ordonnances')
export class StudentOrdonnanceController {
  constructor(private readonly studentOrdonnanceService: StudentOrdonnanceService) {}

  /**
   * Retrieve all student ordonnances with optional filters.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all student ordonnances' })
  @ApiQuery({ name: 'profileId', description: 'Filter by UserProfileId', required: false })
  @ApiResponse({ status: 200, description: 'List of student ordonnances retrieved successfully.', type: [StudentOrdonnance] })
  async findAll(@Query('profileId') profileId?: string): Promise<StudentOrdonnance[]> {
    if (profileId) {
      const studentOrdonnance = await this.studentOrdonnanceService.findByProfileId(parseInt(profileId));
      if (!studentOrdonnance) {
        throw new NotFoundException('Student ordonnance not found.');
      }
      return [studentOrdonnance];
    }
    return this.studentOrdonnanceService.findAll();
  }

  /**
   * Retrieve a specific student ordonnance by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific student ordonnance by ID' })
  @ApiParam({ name: 'id', description: 'Student Ordonnance ID' })
  @ApiResponse({ status: 200, description: 'Student ordonnance retrieved successfully.', type: StudentOrdonnance })
  @ApiResponse({ status: 404, description: 'Student ordonnance not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StudentOrdonnance> {
    return this.studentOrdonnanceService.findOne(id);
  }

  /**
   * Create a new student ordonnance.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new student ordonnance' })
  @ApiBody({ description: 'Student ordonnance data', type: StudentOrdonnance })
  @ApiResponse({ status: 201, description: 'Student ordonnance created successfully.', type: StudentOrdonnance })
  async create(@Body() data: Partial<StudentOrdonnance>): Promise<StudentOrdonnance> {
    return this.studentOrdonnanceService.create(data);
  }

  /**
   * Update an existing student ordonnance by ID.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing student ordonnance by ID' })
  @ApiParam({ name: 'id', description: 'Student Ordonnance ID' })
  @ApiBody({ description: 'Updated data for student ordonnance', type: StudentOrdonnance })
  @ApiResponse({ status: 200, description: 'Student ordonnance updated successfully.', type: StudentOrdonnance })
  @ApiResponse({ status: 404, description: 'Student ordonnance not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<StudentOrdonnance>,
  ): Promise<StudentOrdonnance> {
    return this.studentOrdonnanceService.update(id, data);
  }

  /**
   * Delete a student ordonnance by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student ordonnance by ID' })
  @ApiParam({ name: 'id', description: 'Student Ordonnance ID' })
  @ApiResponse({ status: 204, description: 'Student ordonnance deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Student ordonnance not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.studentOrdonnanceService.delete(id);
  }
}
