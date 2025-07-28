import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetTeacherInvoicesUserRepository, UserWithRole } from './getTeacherInvoices.userRepository';

@Injectable()
export class GetTeacherInvoicesUserTypeOrmRepository implements GetTeacherInvoicesUserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findUserById(userId: number): Promise<UserWithRole | null> {
    try {
      const result = await this.dataSource.query(
        'SELECT id, role FROM users WHERE id = $1',
        [userId]
      );

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      return null;
    }
  }
}