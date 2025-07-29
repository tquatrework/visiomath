import { GetTeacherInvoiceDetailQueryResult } from './getTeacherInvoiceDetail.queryResult';

export interface GetTeacherInvoiceDetailRepository {
  getById(id: number): Promise<GetTeacherInvoiceDetailQueryResult>;
}