// src/exercise/exercises.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from '../../shared/entities/exercise.entity.js';
import { ExerciseService } from './exercises.service.js';
import { ExerciseController } from './exercises.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise]),
            AuthModule],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}
