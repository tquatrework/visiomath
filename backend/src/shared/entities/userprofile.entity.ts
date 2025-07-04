//userprofile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Relation } from 'typeorm';
import { StudentProfile } from './studentProfile.entity.js';
import { StudentOrdonnance } from './studentOrdonnance.entity.js';
import { TeacherProfile } from './teacherProfile.entity.js';
import { TeacherOrdonnance } from './teacherOrdonnance.entity.js';
import { CalendarSlot } from './calendarSlots.entity.js';
import { User } from './user.entity.js';
import {
  SaveTeacherPaymentInfoCommand
} from "../../modules/teacherInvoice/saveTeacherPaymentInfo/teacherPaymentInfo.valueObject";

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { nullable: true })
  passions?: string; // Liste des passions

/*   @Column({ nullable: true })
  pseudo?: string; // Pseudo de l'utilisateur */

  @Column({ nullable: true })
  avatar?: string; // URL de l'avatar

  // Ajouter un champ JSON pour les disponibilités
  //@Column('jsonb', { nullable: true })
  //availability?: {
  //  [day: string]: { start: string; end: string }[]; // Exemple : { "Monday": [{ "start": "09:00", "end": "17:00" }] }
  //};

  @OneToOne(() => User, (user) => user.userProfile, { onDelete: 'CASCADE' })
  user!: Relation<User>; // Liaison avec l'utilisateur principal
  //user!: User;

  @OneToOne(() => StudentProfile, (studentProfile) => studentProfile.userProfile)
  studentProfile?: Relation<StudentProfile>;

  @OneToOne(() => StudentOrdonnance, (studentOrdonnance) => studentOrdonnance.userProfile)
  studentOrdonnance?: Relation<StudentOrdonnance>;

  @OneToOne(() => TeacherProfile, (teacherProfile) => teacherProfile.userProfile)
  teacherProfile?: Relation<TeacherProfile>;

  @OneToOne(() => TeacherOrdonnance, (teacherOrdonnance) => teacherOrdonnance.userProfile)
  teacherOrdonnance?: Relation<TeacherOrdonnance>;

  @OneToMany(() => CalendarSlot, (slot) => slot.userId)
  calendarSlots?: Relation<CalendarSlot[]>;

  addTeacherProfilPaymentInfo(saveTeacherPaymentInfoCommand: SaveTeacherPaymentInfoCommand) {
    this.teacherProfile?.addPaymentInfo(saveTeacherPaymentInfoCommand);
  }
}
