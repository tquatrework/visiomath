import {
    CreateTeacherInvoiceRepository
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.repository";
import {
    CreateTeacherInvoiceCommand
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.command";


export class CreateTeacherInvoiceFailureInMemoryRepository implements CreateTeacherInvoiceRepository {
    async execute(createTeacherInvoiceCommand: CreateTeacherInvoiceCommand): Promise<void> {
        if (createTeacherInvoiceCommand.amount < 0) {
            throw new Error('Le montant de la facture doit être supérieur à 0');
        }
    }
}
