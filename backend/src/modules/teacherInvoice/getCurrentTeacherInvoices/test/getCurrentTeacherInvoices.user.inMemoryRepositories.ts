import { GetCurrentTeacherInvoicesUserRepository } from '../getCurrentTeacherInvoices.user.repository';

export class GetCurrentTeacherInvoicesUserSuccessInMemoryRepository implements GetCurrentTeacherInvoicesUserRepository {
    async findUserById(userId: number): Promise<{ role: string } | null> {
        return { role: 'teacher' };
    }
}

export class GetCurrentTeacherInvoicesUserNotFoundInMemoryRepository implements GetCurrentTeacherInvoicesUserRepository {
    async findUserById(userId: number): Promise<{ role: string } | null> {
        return null;
    }
}

export class GetCurrentTeacherInvoicesUserWrongRoleInMemoryRepository implements GetCurrentTeacherInvoicesUserRepository {
    async findUserById(userId: number): Promise<{ role: string } | null> {
        return { role: 'financial_admin' };
    }
}