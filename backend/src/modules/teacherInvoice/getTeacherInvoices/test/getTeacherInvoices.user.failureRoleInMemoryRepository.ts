import { GetTeacherInvoicesUserRepository, UserWithRole } from '../getTeacherInvoices.userRepository';

export class GetTeacherInvoicesUserFailureRoleInMemoryRepository implements GetTeacherInvoicesUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
      return {
        id: 2,
        role: 'teacher'
      };
  }
}