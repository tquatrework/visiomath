import { SaveTeacherPaymentInfoUserRepository } from '../saveTeacherPaymentInfo.user.repository';

export class SaveTeacherPaymentInfoUserSuccessInMemoryRepository implements SaveTeacherPaymentInfoUserRepository {
    async findUserById(userId: number): Promise<{ id: number; role: string } | null> {
        return { id: userId, role: 'teacher' };
    }
}

export class SaveTeacherPaymentInfoUserNotFoundInMemoryRepository implements SaveTeacherPaymentInfoUserRepository {
    async findUserById(userId: number): Promise<{ id: number; role: string } | null> {
        return null;
    }
}

export class SaveTeacherPaymentInfoUserNotTeacherInMemoryRepository implements SaveTeacherPaymentInfoUserRepository {
    async findUserById(userId: number): Promise<{ id: number; role: string } | null> {
        return { id: userId, role: 'financial_admin' };
    }
}