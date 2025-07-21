import {
    CreateTeacherInvoiceRepository
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.repository";
import {
    CreateTeacherInvoiceCommand
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.command";


export class CreateTeacherInvoiceSuccessInMemoryRepository implements CreateTeacherInvoiceRepository {
    async execute(createTeacherInvoiceCommand: CreateTeacherInvoiceCommand): Promise<void> {
        // Simulation d'un succès - pas de traitement spécifique
    }
}
