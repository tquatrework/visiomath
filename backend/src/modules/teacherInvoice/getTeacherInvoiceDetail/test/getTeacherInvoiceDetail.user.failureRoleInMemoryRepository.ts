import { GetTeacherInvoiceDetailUserRepository, UserWithRole } from '../getTeacherInvoiceDetail.user.repository';

export class GetTeacherInvoiceDetailUserFailureRoleInMemoryRepository implements GetTeacherInvoiceDetailUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
    return {
      id: 2,
      role: 'teacher'
    };
  }
}