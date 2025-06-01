import {  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz } from './quiz.entity.js';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Quiz, quiz => quiz.questions, { nullable: true, onDelete: 'SET NULL' })
  quiz?: Quiz | null;

  @Column()
  order!: number;

  @Column()
  type!: 'text' | 'multiple' | 'order';

  @Column()
  statement!: string;

  @Column({ type: 'jsonb' })
  config!: any; 

  @Column({ type: 'jsonb' })
  answer!: any; 

  @Column({ type: 'text', nullable: true })
  explanation?: string;
}
