import { GetTeacherInvoicesRepository } from '../getTeacherInvoices.repository';
import { GetTeacherInvoicesQueryResult } from '../getTeacherInvoices.queryResult';

export class GetTeacherInvoicesSuccessInMemoryRepository implements GetTeacherInvoicesRepository {
  async getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult> {
    return {
      teacherInvoices: [
        {
          id: 1,
          teacherName: 'David Robert',
          amount: 600,
          pdfFile: 'invoice.pdf',
          creationDate: new Date('2024-01-01'),
          status: 'en attente de validation'
        }
      ]
    };
  }
}