//src/modules/exercise/exercises.controller.ts
import { 
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ExerciseService } from './exercises.service.js';
import { Exercise } from '../../shared/entities/exercise.entity.js';

@ApiTags('Exercises')
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  /**
   * Retrieve all exercises.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all exercises' })
  @ApiResponse({ status: 200, description: 'List of exercises retrieved successfully.', type: [Exercise] })
  async findAll(): Promise<Exercise[]> {
    return this.exerciseService.findAll();
  }

  /**
   * Retrieve a specific exercise by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an exercise by ID' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  @ApiResponse({ status: 200, description: 'Exercise retrieved successfully.', type: Exercise })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Exercise> {
    return this.exerciseService.findOne(id);
  }

  /**
   * Create a new exercise.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiResponse({ status: 201, description: 'Exercise created successfully.', type: Exercise })
  async create(@Body() exerciseData: Partial<Exercise>): Promise<Exercise> {
    return this.exerciseService.create(exerciseData);
  }

  /**
   * Update an existing exercise by ID (partial update).
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Partially update an exercise by ID' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  @ApiResponse({ status: 200, description: 'Exercise updated successfully.', type: Exercise })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() exerciseData: Partial<Exercise>,
  ): Promise<Exercise> {
    return this.exerciseService.update(id, exerciseData);
  }

  /**
   * Delete an exercise by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exercise by ID' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  @ApiResponse({ status: 200, description: 'Exercise deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.exerciseService.delete(id);
  }
}
