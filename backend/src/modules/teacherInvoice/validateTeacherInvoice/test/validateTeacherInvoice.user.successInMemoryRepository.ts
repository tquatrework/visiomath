import { ValidateTeacherInvoiceUserRepository } from '../validateTeacherInvoice.user.repository';

export class ValidateTeacherInvoiceUserSuccessInMemoryRepository implements ValidateTeacherInvoiceUserRepository {
    async findUserById(userId: number): Promise<{ id: number; role: string } | null> {
        return { id: userId, role: 'financial_admin' };
    }
}