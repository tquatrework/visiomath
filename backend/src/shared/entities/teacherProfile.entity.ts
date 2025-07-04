import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import {Exclude} from 'class-transformer';
import { UserProfile } from './userprofile.entity';

export enum teacherCompanyType {
  AE = "AE",
  SARL = "SARL",
  SA = "SA",
}

export type SaveTeacherPaymentInfoCommand = {
  companyName: string;
  siret: string;
  companyType: string;
  vatExempt: boolean;
  iban: string;
  bic: string;
}


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
  userProfile!: Relation<UserProfile>;

  @Column('text', {nullable: true})
  companyName!: string;

  @Column('char', { length: 14, nullable: true })
  siret!: string;

  @Column({
    type: 'enum',
    enum: teacherCompanyType,
    nullable: true,
  })
  companyType!: teacherCompanyType;

  @Column('boolean', {nullable:true})
  vatExempt!: boolean;

  @Column('char', { length: 27, nullable:true })
  iban!: string;

  @Column('varchar', { length: 11, nullable:true })
  bic!: string;

  addPaymentInfo(saveTeacherPaymentInfoCommand: SaveTeacherPaymentInfoCommand) {

    if (saveTeacherPaymentInfoCommand.siret.length !== 14) {
      throw new Error("Le SIRET doit contenir 14 caractères.");
    }

    if (saveTeacherPaymentInfoCommand.companyType !== teacherCompanyType.AE &&
        saveTeacherPaymentInfoCommand.companyType !== teacherCompanyType.SARL &&
        saveTeacherPaymentInfoCommand.companyType !== teacherCompanyType.SA) {
      throw new Error("Ce type d’entreprise n’existe pas");
    }

    const ibanRegex = /^[A-Z]{2}\d{25}$/;
    if (!ibanRegex.test(saveTeacherPaymentInfoCommand.iban)) {
      throw new Error("L’IBAN doit commencer par 2 lettres suivies de 25 chiffres.");
    }

    const bicRegex = /^[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$/i;
    if (!bicRegex.test(saveTeacherPaymentInfoCommand.bic)) {
      throw new Error("Le BIC doit contenir 6 lettres suivies de 2 ou 5 caractères alphanumériques.");
    }

    this.companyName = saveTeacherPaymentInfoCommand.companyName;
    this.siret = saveTeacherPaymentInfoCommand.siret;
    this.companyType = saveTeacherPaymentInfoCommand.companyType;
    this.vatExempt = saveTeacherPaymentInfoCommand.vatExempt;
    this.iban = saveTeacherPaymentInfoCommand.iban;
    this.bic = saveTeacherPaymentInfoCommand.bic;
  }

}
