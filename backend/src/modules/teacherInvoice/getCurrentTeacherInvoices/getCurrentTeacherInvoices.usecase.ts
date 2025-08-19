import { Injectable, Inject } from '@nestjs/common';
import { GetCurrentTeacherInvoicesTeacherInvoiceRepository } from './getCurrentTeacherInvoices.teacherInvoice.repository';
import { GetCurrentTeacherInvoicesUserRepository } from './getCurrentTeacherInvoices.user.repository';
import { GetCurrentTeacherInvoicesQueryResult } from './getCurrentTeacherInvoices.queryResult';
import { GetCurrentTeacherInvoicesUserTypeOrmRepository } from './getCurrentTeacherInvoices.user.typeOrmRepository';
import { GetCurrentTeacherInvoicesTeacherInvoiceTypeOrmRepository } from './getCurrentTeacherInvoices.teacherInvoice.typeOrmRepository';

@Injectable()
export class GetCurrentTeacherInvoicesUsecase {
    constructor(
        @Inject(GetCurrentTeacherInvoicesUserTypeOrmRepository)
        private readonly userRepository: GetCurrentTeacherInvoicesUserRepository,
        @Inject(GetCurrentTeacherInvoicesTeacherInvoiceTypeOrmRepository)
        private readonly teacherInvoiceRepository: GetCurrentTeacherInvoicesTeacherInvoiceRepository
    ) {}

    async execute(userId: number): Promise<GetCurrentTeacherInvoicesQueryResult> {
        const user = await this.userRepository.findUserById(userId);

        if (!user) {
            throw new Error('Responsable financier non trouvé');
        }

        if (user.role !== 'teacher') {
            throw new Error('Vous ne pouvez pas effectuer cette opération');
        }

        try {
            return await this.teacherInvoiceRepository.getByUserId(userId);
        } catch (error) {
            throw new Error('la récupération des factures à échoué');
        }
    }
}