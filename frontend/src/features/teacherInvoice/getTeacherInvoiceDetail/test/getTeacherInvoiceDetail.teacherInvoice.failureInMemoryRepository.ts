import { GetTeacherInvoiceDetailTeacherInvoiceRepository } from '../getTeacherInvoiceDetail.teacherInvoice.repository';
import { GetTeacherInvoiceDetailQueryResult } from '../getTeacherInvoiceDetail.queryResult';

export class GetTeacherInvoiceDetailTeacherInvoiceFailureInMemoryRepository implements GetTeacherInvoiceDetailTeacherInvoiceRepository {
  async getById(id: number): Promise<GetTeacherInvoiceDetailQueryResult> {
    throw new Error('la récupération de la facture à échoué');
  }
}