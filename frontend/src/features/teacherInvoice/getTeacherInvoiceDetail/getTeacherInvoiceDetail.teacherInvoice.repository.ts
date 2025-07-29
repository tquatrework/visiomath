import { GetTeacherInvoiceDetailQueryResult } from './getTeacherInvoiceDetail.queryResult';

export interface GetTeacherInvoiceDetailTeacherInvoiceRepository {
  getById(id: number): Promise<GetTeacherInvoiceDetailQueryResult>;
}