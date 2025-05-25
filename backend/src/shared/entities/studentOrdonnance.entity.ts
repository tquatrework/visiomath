import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserProfile } from './userprofile.entity.js';

@Entity('student_ordonnances')
export class StudentOrdonnance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: true })
  consideration_generale?: string;

  @Column('text', { nullable: true })
  preco_rythme?: string;

  @Column('text', { nullable: true })
  preco_type_formateur?: string;

  @Column('text', { nullable: true })
  preco_parcours?: string;

  @Column('text', { nullable: true })
  preco_activites?: string;

  @Column({ nullable: true })
  rempli_par?: string; // Pseudo de l'utilisateur ayant rempli

  @OneToOne(() => UserProfile, (userProfile) => userProfile.studentOrdonnance, { onDelete: 'CASCADE' })
  @JoinColumn()
    @Exclude()
  userProfile!: Relation<UserProfile>;
}
