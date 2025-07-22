import { TeacherInvoice } from './teacherInvoice.entity';
import { User } from '../../../shared/entities/user.entity';

export interface CreateTeacherInvoiceRepository {
    findUserById(userId: number): Promise<User | null>;
    save(teacherInvoice: TeacherInvoice): Promise<void>;
    hasInvoiceForCurrentMonth(teacherId: number, currentDate: Date): Promise<boolean>;
}
