import { TeacherInvoice } from '../createTeacherInvoice/teacherInvoice.entity';

export interface PayTeacherInvoiceTeacherInvoiceRepository {
    findById(id: number): Promise<TeacherInvoice | null>;
    save(teacherInvoice: TeacherInvoice): Promise<void>;
}