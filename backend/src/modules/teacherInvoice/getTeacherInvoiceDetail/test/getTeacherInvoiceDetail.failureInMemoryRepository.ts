import { GetTeacherInvoiceDetailRepository } from '../getTeacherInvoiceDetail.repository';
import { GetTeacherInvoiceDetailQueryResult } from '../getTeacherInvoiceDetail.queryResult';

export class GetTeacherInvoiceDetailFailureInMemoryRepository implements GetTeacherInvoiceDetailRepository {
  async getById(id: number): Promise<GetTeacherInvoiceDetailQueryResult> {
    throw new Error('erreur BDD');
  }
}