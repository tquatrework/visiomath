import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Relation, JoinColumn } from 'typeorm';
import {Exclude} from 'class-transformer';
import { UserProfile } from './userprofile.entity';


export type AddTeacherPaymentInfoCommand = {
  companyName: string;
  siret: string;
  companyType: string;
  subjectToVat: boolean;
  iban: string;
  bic: string;
}

export type IncreaseTeacherAmountToInvoiceCommand = {
  amount: number;
}

export enum CompanyType {
    Autoentrepreneur = 'Autoentrepreneur',
    EI = 'EI',
    EURL = 'EURL',
    SARL = 'SARL',
    SA = 'SA',
    SAS = 'SAS',
    SASU = 'SASU',
    SNC = 'SNC',
    Scop = 'Scop',
    Association = 'Association'
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

  @Column('text', {nullable:true})
  companyType!: string;

  @Column('boolean', {nullable:true})
  subjectToVat!: boolean;

  @Column('char', { length: 27, nullable:true })
  iban!: string;

  @Column('varchar', { length: 11, nullable:true })
  bic!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amountToInvoice!: number;

  addPaymentInfo(saveTeacherPaymentInfoCommand: AddTeacherPaymentInfoCommand) {

    if (saveTeacherPaymentInfoCommand.siret.length !== 14) {
      throw new Error("Le SIRET doit contenir 14 caractères.");
    }

    const ibanRegex = /^FR[0-9]{12}[A-Z0-9]{13}$/i;
    if (!ibanRegex.test(saveTeacherPaymentInfoCommand.iban)) {
      throw new Error("L’IBAN doit commencer par 2 lettres suivies de 12 chiffres suivies de 13 caractères alphanumériques.");
    }

    const bicRegex = /^[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$/i;
    if (!bicRegex.test(saveTeacherPaymentInfoCommand.bic)) {
      throw new Error("Le BIC doit contenir 6 lettres suivies de 2 ou 5 caractères alphanumériques.");
    }

    if (!Object.values(CompanyType).includes(saveTeacherPaymentInfoCommand.companyType as CompanyType)) {
      throw new Error("Le type d’entreprise n’est pas valide.");
    }

    this.companyName = saveTeacherPaymentInfoCommand.companyName;
    this.siret = saveTeacherPaymentInfoCommand.siret;
    this.companyType = saveTeacherPaymentInfoCommand.companyType;
    this.subjectToVat = saveTeacherPaymentInfoCommand.subjectToVat;
    this.iban = saveTeacherPaymentInfoCommand.iban;
    this.bic = saveTeacherPaymentInfoCommand.bic;
  }

  increaseAmountToInvoice(amount: number): void {
    if (amount <= 0) {
      throw new Error("Le montant doit supérieur à 0.");
    }
    this.amountToInvoice = Number(this.amountToInvoice) + amount;
  }

  payInvoice(amount: number): void {

    const currentAmount = this.amountToInvoice || 0;

    if (currentAmount < amount) {
      throw new Error("le solde à facturer doit être supérieur au montant de la facture");
    }


    this.amountToInvoice = currentAmount - amount;
  }

}
