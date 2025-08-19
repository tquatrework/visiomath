import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetCurrentTeacherInvoicesUserRepository } from './getCurrentTeacherInvoices.user.repository';

@Injectable()
export class GetCurrentTeacherInvoicesUserTypeOrmRepository implements GetCurrentTeacherInvoicesUserRepository {
    constructor(private readonly dataSource: DataSource) {}

    async findUserById(userId: number): Promise<{ role: string } | null> {
        const result = await this.dataSource.query(
            'SELECT role FROM users WHERE id = $1',
            [userId]
        );
        
        return result.length > 0 ? { role: result[0].role } : null;
    }
}