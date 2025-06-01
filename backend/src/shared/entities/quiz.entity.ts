import {  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { QuizQuestion } from './quizQuestion.entity.js';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  level!: string;

  @Column()
  difficulty!: string;

  @Column()
  language?: string='fr';

  @Column()
  chapter!: string;

  @Column()
  subChapter?: string;

  @Column("text", { array: true, default: [] })
  tags?: string[]=[];

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: 0 })
  votedInterest!: number;

  @Column({ default: 0 })
  nbVotedInterest!: number;

  @Column({ default: 0 })
  votedDifficulty!: number;

  @Column({ default: 0 })
  nbVotedDifficulty!: number;

  @Column()
  authorId?: string = "inconnu";

  @OneToMany(() => QuizQuestion, question => question.quiz, { cascade: true })
  @JoinColumn()
  questions?: QuizQuestion[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
