import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { quizQuestionType, QuizQuestionType } from '../../common/utils/lists.utils.js';

class CreateQuizQuestionDto {
  @IsIn(quizQuestionType)
  type!: QuizQuestionType;

  @IsString()
  statement!: string;

  @IsNotEmpty()
  order!: number;

  @IsNotEmpty()
  config!: any;
    
  @IsNotEmpty()
  answer!: any;
    
  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CreateQuizDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  level!: string;

  @IsString()
  difficulty!: string;

  @IsString()
  language?: string;

  @IsString()
  chapter!: string;

  @IsString()
  subChapter?: string;

  @IsArray()
  @IsString({ each: true })
  tags?: string[]=[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  authorId?: string= "inconnu";

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  questions?: CreateQuizQuestionDto[];
}
