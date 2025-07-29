import { GetTeacherInvoiceDetailRepository } from '../getTeacherInvoiceDetail.repository';
import { GetTeacherInvoiceDetailQueryResult } from '../getTeacherInvoiceDetail.queryResult';

export class GetTeacherInvoiceDetailSuccessInMemoryRepository implements GetTeacherInvoiceDetailRepository {
  async getById(id: number): Promise<GetTeacherInvoiceDetailQueryResult> {
    return {
      id: 1,
      teacherName: 'David Robert',
      amount: 600,
      creationDate: '2024-01-15',
      pdfFile: 'facture-david-robert.pdf'
    };
  }
}