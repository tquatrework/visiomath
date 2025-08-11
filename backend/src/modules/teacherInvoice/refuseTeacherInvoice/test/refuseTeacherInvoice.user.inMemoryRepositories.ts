import { RefuseTeacherInvoiceUserRepository } from '../refuseTeacherInvoice.user.repository';

export class RefuseTeacherInvoiceUserSuccessInMemoryRepository implements RefuseTeacherInvoiceUserRepository {
    async findById(userId: number): Promise<{ id: number; role: string } | null> {
        return Promise.resolve({ id: userId, role: 'financial_admin'});
    }
}

export class RefuseTeacherInvoiceUserFailureInMemoryRepository implements RefuseTeacherInvoiceUserRepository {
    async findById(userId: number): Promise<{ id: number; role: string } | null> {
        return Promise.resolve(null);
    }
}

export class RefuseTeacherInvoiceUserTeacherInMemoryRepository implements RefuseTeacherInvoiceUserRepository {
    async findById(userId: number): Promise<{ id: number; role: string } | null> {
        return Promise.resolve({ id: userId, role: 'teacher'});
    }
}