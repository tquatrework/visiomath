import { GetTeacherInvoicesQueryResult } from './getTeacherInvoices.queryResult';

export interface GetTeacherInvoicesRepository {
  getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult>;
}