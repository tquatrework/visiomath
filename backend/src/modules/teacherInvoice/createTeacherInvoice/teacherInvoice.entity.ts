import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../shared/entities/user.entity';

export enum TeacherInvoiceStatus {
    EN_ATTENTE_DE_VALIDATION = 'en attente de validation',
    VALIDE = 'validé'
}

@Entity('teacher_invoices')
export class TeacherInvoice {
    @PrimaryGeneratedColumn()
    id: number | null = null;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'teacherId' })
    teacher: User;
    
    @Column()
    amount: number;
    
    @Column()
    pdfFile: string;
    
    @Column()
    creationDate: Date;
    
    @Column({
        type: 'enum',
        enum: TeacherInvoiceStatus,
        default: TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION
    })
    status: TeacherInvoiceStatus;
    
    @Column({ type: "date", nullable: true })
    validatedAt: Date | null;

    constructor(
        teacher: User,
        amount: number,
        pdfFile: string,
        creationDate: Date
    ) {
        if (amount <= 0) {
            throw new Error("le montant de la facture doit être supérieur à 0");
        }
        
        this.teacher = teacher;
        this.amount = amount;
        this.pdfFile = pdfFile;
        this.creationDate = creationDate;
        this.status = TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION;
        this.validatedAt = null;
    }
    
    validate(): void {
        if (this.amount > 2500) {
            throw new Error("La facture a un montant supérieur à 2500e");
        }
        
        this.status = TeacherInvoiceStatus.VALIDE;
        this.validatedAt = new Date();
    }
}
