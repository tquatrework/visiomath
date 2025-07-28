import { GetTeacherInvoicesUserRepository, UserWithRole } from '../getTeacherInvoices.userRepository';

export class GetTeacherInvoicesUserFailureInMemoryRepository implements GetTeacherInvoicesUserRepository {
  async findUserById(userId: number): Promise<UserWithRole | null> {

    if (userId === 999) {
      return null;
    }

    throw new Error('Erreur BDD');
  }
}