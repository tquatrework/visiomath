import { TeacherInvoice } from '../createTeacherInvoice/teacherInvoice.entity';

export interface RefuseTeacherInvoiceRepository {
    findById(invoiceId: number): Promise<TeacherInvoice | null>;
    save(invoice: TeacherInvoice): Promise<void>;
}