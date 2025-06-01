import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../../shared/entities/quiz.entity.js';
import { QuizQuestion } from '../../shared/entities/quizQuestion.entity.js';
import { QuizzesService } from './quizzes.service.js';
import { QuizzesController } from './quizzes.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, QuizQuestion])],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService]
})
export class QuizzesModule {}
