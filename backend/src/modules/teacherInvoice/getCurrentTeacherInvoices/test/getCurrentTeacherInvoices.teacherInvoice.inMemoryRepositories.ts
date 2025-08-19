import { GetCurrentTeacherInvoicesTeacherInvoiceRepository } from '../getCurrentTeacherInvoices.teacherInvoice.repository';
import { GetCurrentTeacherInvoicesQueryResult } from '../getCurrentTeacherInvoices.queryResult';

export class GetCurrentTeacherInvoicesTeacherInvoiceSuccessInMemoryRepository implements GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    async getByUserId(userId: number): Promise<GetCurrentTeacherInvoicesQueryResult> {
        return {
            invoices: [
                {
                    id: 1,
                    status: "validée",
                    amount: 300,
                    creationDate: "12/12/2023",
                    pdfFile: "invoice_1.pdf"
                }
            ]
        };
    }
}

export class GetCurrentTeacherInvoicesTeacherInvoiceFailureInMemoryRepository implements GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    async getByUserId(userId: number): Promise<GetCurrentTeacherInvoicesQueryResult> {
        throw new Error('la récupération des factures à échoué');
    }
}