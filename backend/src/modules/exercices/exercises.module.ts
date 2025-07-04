// src/exercise/exercises.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from '../../shared/entities/exercise.entity';
import { ExerciseService } from './exercises.service';
import { ExerciseController } from './exercises.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise]),
            AuthModule],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}
