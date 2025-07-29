import { GetTeacherInvoiceDetailUserRepository, UserWithRole } from '../getTeacherInvoiceDetail.user.repository';

export class GetTeacherInvoiceDetailUserFailureInMemoryRepository implements GetTeacherInvoiceDetailUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {
    if (userId === 999) {
      return null;
    }
    
    throw new Error('Erreur BDD');
  }
}