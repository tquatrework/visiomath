import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetTeacherInvoiceDetailUserRepository, UserWithRole } from './getTeacherInvoiceDetail.user.repository';

@Injectable()
export class GetTeacherInvoiceDetailUserTypeOrmRepository implements GetTeacherInvoiceDetailUserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findUserById(userId: number): Promise<UserWithRole | null> {
    const result = await this.dataSource.query(
      'SELECT id, role FROM users WHERE id = $1',
      [userId]
    );

    if (result.length === 0) {
      return null;
    }

    return {
      id: result[0].id,
      role: result[0].role
    };
  }
}