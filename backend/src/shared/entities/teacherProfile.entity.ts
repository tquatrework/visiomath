import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import {Exclude} from 'class-transformer';
import { UserProfile } from './userprofile.entity.js';

@Entity('teacher_profiles')
export class TeacherProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: true })
  diplomes?: string;

  @Column('text', { nullable: true })
  experience?: string;

  @Column('text', { nullable: true })
  specialites?: string;

  @Column('text', { nullable: true })
  particularites?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.teacherProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
    @Exclude()
  userProfile!: Relation<UserProfile>;
}
