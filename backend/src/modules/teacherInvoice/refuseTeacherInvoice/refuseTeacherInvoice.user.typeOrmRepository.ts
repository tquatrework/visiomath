import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../shared/entities/user.entity';
import { RefuseTeacherInvoiceUserRepository } from './refuseTeacherInvoice.user.repository';

@Injectable()
export class RefuseTeacherInvoiceUserTypeOrmRepository implements RefuseTeacherInvoiceUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findById(userId: number): Promise<{ id: number; role: string } | null> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            role: user.role
        };
    }
}