import { TeacherInvoice } from '../createTeacherInvoice/teacherInvoice.entity';

export interface ValidateTeacherInvoiceRepository {
    findById(id: number): Promise<TeacherInvoice | null>;
    save(invoice: TeacherInvoice): Promise<void>;
}