import { GetTeacherInvoicesNumberForCurrentMonthUserRepository, UserWithRole } from '../getTeacherInvoicesNumberForCurrentMonth.user.repository';

export class GetTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
    return {
      id: userId,
      role: 'teacher'
    };
  }
}

export class GetTeacherInvoicesNumberForCurrentMonthUserNotFoundInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
    return null;
  }
}

export class GetTeacherInvoicesNumberForCurrentMonthUserWrongRoleInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
    return {
      id: userId,
      role: 'financial_admin'
    };
  }
}