import { GetTeacherInvoicesQueryResult } from './getTeacherInvoices.queryResult';

export interface GetTeacherInvoicesInvoicesRepository {
  getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult>;
}