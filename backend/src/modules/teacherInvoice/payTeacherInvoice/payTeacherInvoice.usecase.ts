import { Injectable, Inject } from '@nestjs/common';
import { PayTeacherInvoiceUserRepository } from './payTeacherInvoice.user.repository';
import { PayTeacherInvoiceTeacherInvoiceRepository } from './payTeacherInvoice.teacherInvoice.repository';
import { PayTeacherInvoiceCommand } from './payTeacherInvoice.command';
import { PayTeacherInvoiceUserTypeOrmRepository } from './payTeacherInvoice.user.typeOrmRepository';
import { PayTeacherInvoiceTeacherInvoiceTypeOrmRepository } from './payTeacherInvoice.teacherInvoice.typeOrmRepository';

@Injectable()
export class PayTeacherInvoiceUsecase {
    constructor(
        @Inject(PayTeacherInvoiceUserTypeOrmRepository)
        private payTeacherInvoiceUserRepository: PayTeacherInvoiceUserRepository,
        @Inject(PayTeacherInvoiceTeacherInvoiceTypeOrmRepository)
        private payTeacherInvoiceTeacherInvoiceRepository: PayTeacherInvoiceTeacherInvoiceRepository
    ) {}

    async execute(userId: number, command: PayTeacherInvoiceCommand): Promise<void> {
        const user = await this.payTeacherInvoiceUserRepository.findById(userId);
        
        if (!user) {
            throw new Error("Responsable financier non trouvé");
        }
        
        if (user.role !== 'financial_admin') {
            throw new Error("Vous ne pouvez pas effectuer cette opération");
        }
        
        const teacherInvoice = await this.payTeacherInvoiceTeacherInvoiceRepository.findById(command.teacherInvoiceId);
        
        if (!teacherInvoice) {
            throw new Error("La récupération de la facture a échoué");
        }
        
        teacherInvoice.pay();

        try {
            await this.payTeacherInvoiceTeacherInvoiceRepository.save(teacherInvoice);
        } catch (error) {
            throw new Error("L'enregistrement de la facture a échoué");
        }
    }
}