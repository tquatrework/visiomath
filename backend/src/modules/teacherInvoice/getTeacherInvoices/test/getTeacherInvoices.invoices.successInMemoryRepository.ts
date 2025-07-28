import { GetTeacherInvoicesInvoicesRepository } from '../getTeacherInvoices.invoicesRepository';
import { GetTeacherInvoicesQueryResult } from '../getTeacherInvoices.queryResult';

export class GetTeacherInvoicesInvoicesSuccessInMemoryRepository implements GetTeacherInvoicesInvoicesRepository {
  async getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult> {
    return {
      teacherInvoices: [
        {
          id: 1,
          teacherName: 'David Robert',
          amount: 600,
          pdfFile: 'invoice-1.pdf',
          creationDate: new Date('2024-01-15'),
          status: 'en attente de validation'
        }
      ]
    };
  }
}