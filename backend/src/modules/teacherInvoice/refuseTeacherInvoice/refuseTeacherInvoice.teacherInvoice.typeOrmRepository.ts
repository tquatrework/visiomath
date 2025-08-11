import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherInvoice } from '../createTeacherInvoice/teacherInvoice.entity';
import { RefuseTeacherInvoiceRepository } from './refuseTeacherInvoice.repository';

@Injectable()
export class RefuseTeacherInvoiceTeacherInvoiceTypeOrmRepository implements RefuseTeacherInvoiceRepository {
    constructor(
        @InjectRepository(TeacherInvoice)
        private readonly teacherInvoiceRepository: Repository<TeacherInvoice>
    ) {}

    async findById(id: number): Promise<TeacherInvoice | null> {
        return await this.teacherInvoiceRepository.findOne({
            where: { id }
        });
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        await this.teacherInvoiceRepository.save(invoice);
    }
}