import { TeacherInvoice } from './teacherInvoice.entity';

export interface CreateTeacherInvoiceTeacherInvoiceRepository {
    save(teacherInvoice: TeacherInvoice): Promise<void>;
}
