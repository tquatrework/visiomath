import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserProfile } from './userprofile.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  niveau?: string;

  @Column({ default: false })
  difficultes_visible!: boolean;

  @Column('text', { nullable: true })
  difficultes?: string;

  @Column({ default: false })
  contexte_visible!: boolean;

  @Column('text', { nullable: true })
  contexte?: string;

  @Column('text', { nullable: true })
  objectifs?: string;

  @Column({ default: false })
  teacherSearch: boolean = false;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.studentProfile, { onDelete: 'CASCADE' })
  @JoinColumn()  
    @Exclude()
  userProfile!: Relation<UserProfile>;
}