import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../shared/entities/user.entity';
import { ValidateTeacherInvoiceUserRepository } from './validateTeacherInvoice.user.repository';

@Injectable()
export class ValidateTeacherInvoiceUserTypeOrmRepository implements ValidateTeacherInvoiceUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findUserById(userId: number): Promise<{ id: number; role: string } | null> {
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