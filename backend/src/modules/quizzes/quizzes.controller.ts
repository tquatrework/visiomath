import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service.js';
import { CreateQuizDto } from '../../shared/dto/create-quiz.dto.js';
import { Quiz } from '../../shared/entities/quiz.entity.js';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  async findAll(): Promise<Quiz[]> {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Quiz> {
    return this.quizzesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.quizzesService.remove(id);
  }
}
