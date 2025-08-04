import { ValidateTeacherInvoiceUserRepository } from '../validateTeacherInvoice.user.repository';

export class ValidateTeacherInvoiceUserFailureInMemoryRepository implements ValidateTeacherInvoiceUserRepository {
    async findUserById(userId: number): Promise<{ id: number; role: string } | null> {
        return null;
    }
}