import { GetTeacherInvoiceDetailTeacherInvoiceRepository } from '../getTeacherInvoiceDetail.teacherInvoice.repository';
import { GetTeacherInvoiceDetailQueryResult } from '../getTeacherInvoiceDetail.queryResult';

export class GetTeacherInvoiceDetailTeacherInvoiceSuccessInMemoryRepository implements GetTeacherInvoiceDetailTeacherInvoiceRepository {
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