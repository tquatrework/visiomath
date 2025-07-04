import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserProfile } from './userprofile.entity';

@Entity('teacher_ordonnances')
export class TeacherOrdonnance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  niveau_max_valide?: string;

  @Column({ nullable: true })
  public_type?: string;

  @Column('text', { nullable: true })
  resultats_test?: string;

  @Column('text', { nullable: true })
  commentaires_test?: string;

  @Column({ nullable: true })
  rempli_par?: string; // ID ou pseudo de l'utilisateur ayant rempli

  @OneToOne(() => UserProfile, (userProfile) => userProfile.teacherOrdonnance, { onDelete: 'CASCADE' })
  @JoinColumn()
    @Exclude()
  userProfile!: Relation<UserProfile>;
}
