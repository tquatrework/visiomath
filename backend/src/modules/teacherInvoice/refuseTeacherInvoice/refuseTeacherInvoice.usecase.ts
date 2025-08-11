import { Inject } from '@nestjs/common';
import { RefuseTeacherInvoiceUserRepository } from './refuseTeacherInvoice.user.repository';
import { RefuseTeacherInvoiceRepository } from './refuseTeacherInvoice.repository';
import { RefuseTeacherInvoiceCommand } from './refuseTeacherInvoice.command';
import { RefuseTeacherInvoiceUserTypeOrmRepository } from './refuseTeacherInvoice.user.typeOrmRepository';
import { RefuseTeacherInvoiceTeacherInvoiceTypeOrmRepository } from './refuseTeacherInvoice.teacherInvoice.typeOrmRepository';

export class RefuseTeacherInvoiceUsecase {
    constructor(
        @Inject(RefuseTeacherInvoiceUserTypeOrmRepository)
        private readonly userRepository: RefuseTeacherInvoiceUserRepository,
        @Inject(RefuseTeacherInvoiceTeacherInvoiceTypeOrmRepository)
        private readonly invoiceRepository: RefuseTeacherInvoiceRepository,
    ) {}

    async execute(userId: number, command: RefuseTeacherInvoiceCommand): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Responsable financier non trouvé');
        }
        
        if (user.role !== 'financial_admin') {
            throw new Error('Vous ne pouvez pas effectuer cette opération');
        }

        const invoice = await this.invoiceRepository.findById(command.invoiceId);
        
        if (!invoice) {
            throw new Error('la récupération de la facture à échoué');
        }

        invoice.refuse(command.refusalReason);

        try {
            await this.invoiceRepository.save(invoice);
        } catch (error) {
            throw new Error("l'enregistrement de la facture à échoué");
        }
    }
}