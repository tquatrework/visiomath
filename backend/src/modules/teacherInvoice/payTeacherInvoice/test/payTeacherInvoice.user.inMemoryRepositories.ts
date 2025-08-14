import { PayTeacherInvoiceUserRepository } from '../payTeacherInvoice.user.repository';

export class PayTeacherInvoiceUserSuccessInMemoryRepository implements PayTeacherInvoiceUserRepository {
    async findById(userId: number): Promise<{ id: number; role: string } | null> {
        return Promise.resolve({ id: userId, role: 'financial_admin'});
    }
}

export class PayTeacherInvoiceUserFailureInMemoryRepository implements PayTeacherInvoiceUserRepository {
    async findById(userId: number): Promise<{ id: number; role: string } | null> {
        return Promise.resolve(null);
    }
}

export class PayTeacherInvoiceUserTeacherInMemoryRepository implements PayTeacherInvoiceUserRepository {
    async findById(userId: number): Promise<{ id: number; role: string } | null> {
        return Promise.resolve({ id: userId, role: 'teacher'});
    }
}