//src/modules/exercise/exercises.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../../shared/entities/exercise.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  /**
   * Retrieve all exercises.
   */
  async findAll(): Promise<Exercise[]> {
    return this.exerciseRepository.find();
  }

  /**
   * Retrieve a specific exercise by ID.
   */
  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  /**
   * Create a new exercise.
   */
  async create(exerciseData: Partial<Exercise>): Promise<Exercise> {
    const newExercise = this.exerciseRepository.create(exerciseData);
    return this.exerciseRepository.save(newExercise);
  }

  /**
   * Update an existing exercise.
   */
  async update(id: number, exerciseData: Partial<Exercise>): Promise<Exercise> {
    await this.findOne(id); // Vérification de l'existence
    await this.exerciseRepository.update(id, exerciseData);
    return this.findOne(id);
  }

  /**
   * Delete an exercise.
   */
  async delete(id: number): Promise<void> {
    const result = await this.exerciseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
  }
}
