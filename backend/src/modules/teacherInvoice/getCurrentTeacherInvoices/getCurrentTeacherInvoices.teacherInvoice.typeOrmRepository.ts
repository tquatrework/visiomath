import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetCurrentTeacherInvoicesTeacherInvoiceRepository } from './getCurrentTeacherInvoices.teacherInvoice.repository';
import { GetCurrentTeacherInvoicesQueryResult } from './getCurrentTeacherInvoices.queryResult';

@Injectable()
export class GetCurrentTeacherInvoicesTeacherInvoiceTypeOrmRepository implements GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    constructor(private readonly dataSource: DataSource) {}

    async getByUserId(userId: number): Promise<GetCurrentTeacherInvoicesQueryResult> {
        const result = await this.dataSource.query(
            'SELECT id, status, amount, "creationDate", "pdfFile" FROM teacher_invoices WHERE "teacherId" = $1 ORDER BY "creationDate" DESC',
            [userId]
        );
        
        return {
            invoices: result.map((invoice: any) => ({
                id: invoice.id,
                status: invoice.status,
                amount: invoice.amount,
                creationDate: invoice.creationDate.toLocaleDateString('fr-FR'),
                pdfFile: invoice.pdfFile
            }))
        };
    }
}