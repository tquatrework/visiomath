import {
    CreateTeacherInvoiceCommand
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.command";

export interface CreateTeacherInvoiceRepository {
    execute(createTeacherInvoiceCommand: CreateTeacherInvoiceCommand): Promise<void>
}
