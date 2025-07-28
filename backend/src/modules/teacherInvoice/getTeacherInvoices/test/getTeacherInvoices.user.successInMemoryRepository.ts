import { GetTeacherInvoicesUserRepository, UserWithRole } from '../getTeacherInvoices.userRepository';

export class GetTeacherInvoicesUserSuccessInMemoryRepository implements GetTeacherInvoicesUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
    if (userId === 1) {
      return {
        id: 1,
        role: 'financial_admin'
      };
    }
    return null;
  }
}