import { GetTeacherInvoiceDetailUserRepository, UserWithRole } from '../getTeacherInvoiceDetail.user.repository';

export class GetTeacherInvoiceDetailUserSuccessInMemoryRepository implements GetTeacherInvoiceDetailUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
    return {
      id: 1,
      role: 'financial_admin'
    };
  }
}