import { Inject } from '@nestjs/common';
import { ValidateTeacherInvoiceRepository } from './validateTeacherInvoice.repository';
import { ValidateTeacherInvoiceUserRepository } from './validateTeacherInvoice.user.repository';
import { ValidateTeacherInvoiceCommand } from './validateTeacherInvoice.command';
import { ValidateTeacherInvoiceTeacherInvoiceTypeOrmRepository } from './validateTeacherInvoice.teacherInvoice.typeOrmRepository';
import { ValidateTeacherInvoiceUserTypeOrmRepository } from './validateTeacherInvoice.user.typeOrmRepository';

export class ValidateTeacherInvoiceUsecase {
    constructor(
        @Inject(ValidateTeacherInvoiceUserTypeOrmRepository)
        private validateTeacherInvoiceUserRepository: ValidateTeacherInvoiceUserRepository,
        @Inject(ValidateTeacherInvoiceTeacherInvoiceTypeOrmRepository)
        private validateTeacherInvoiceRepository: ValidateTeacherInvoiceRepository
    ) {}

    async execute(userId: number, command: ValidateTeacherInvoiceCommand): Promise<void> {
        const user = await this.validateTeacherInvoiceUserRepository.findUserById(userId);

        if (!user) {
            throw new Error('Responsable financier non trouvé');
        }

        if (user.role !== 'financial_admin') {
            throw new Error('Vous ne pouvez pas effectuer cette opération');
        }

        const invoice = await this.validateTeacherInvoiceRepository.findById(command.invoiceId);
        
        if (!invoice) {
            throw new Error("la récupération de la facture à échoué");
        }
        
        invoice.validate();
        
        try {
            await this.validateTeacherInvoiceRepository.save(invoice);
        } catch (error) {
            throw new Error("l'enregistrement de la facture à échoué");
        }
    }
}