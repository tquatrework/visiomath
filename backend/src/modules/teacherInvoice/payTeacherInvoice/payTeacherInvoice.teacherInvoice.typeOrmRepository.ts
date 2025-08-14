import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherInvoice } from '../createTeacherInvoice/teacherInvoice.entity';
import { PayTeacherInvoiceTeacherInvoiceRepository } from './payTeacherInvoice.teacherInvoice.repository';
import { TeacherProfile } from '../../../shared/entities/teacherProfile.entity';

@Injectable()
export class PayTeacherInvoiceTeacherInvoiceTypeOrmRepository implements PayTeacherInvoiceTeacherInvoiceRepository {
    constructor(
        @InjectRepository(TeacherInvoice)
        private readonly teacherInvoiceRepository: Repository<TeacherInvoice>
    ) {}

    async findById(id: number): Promise<TeacherInvoice | null> {
        return await this.teacherInvoiceRepository.findOne({
            where: { id },
            relations: ['teacher', 'teacher.userProfile', 'teacher.userProfile.teacherProfile']
        });
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        await this.teacherInvoiceRepository.save(invoice);
    }
}