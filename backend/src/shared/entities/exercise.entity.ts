// src/exercise/exercise.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  title!: string;

  @Column()
  chapter!: string;

  @Column({ nullable: true })
  subChapter?: string;

  @Column({ nullable: true })
  level?: string;

  @Column('int', { nullable: true })
  intendedDifficulty?: number;

  @Column('text', { nullable: true })
  tags?: string;

  @Column('text')
  statementText!: string;

  @Column({ nullable: true })
  statementImage?: string;

  @Column('jsonb' , { nullable: true })
  questionStructure?: string; // Translated from "structure questions"

  @Column('boolean', { default: false })
  isPublished: boolean = false;

  @Column('text', { nullable: true })
  solutionText?: string;

  @Column({ nullable: true })
  solutionImage?: string;

  @Column('int', { nullable: true })
  votedInterest?: number;

  @Column('int', { default: 0 })
  nbVotedInterest: number = 0;

  @Column('int', { nullable: true })
  votedDifficulty?: number;

  @Column('int', { default: 0 })
  nbVotedDifficulty: number = 0;

  @Column('text', { nullable: true })
  help?: string; // Translated from "aide"

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
