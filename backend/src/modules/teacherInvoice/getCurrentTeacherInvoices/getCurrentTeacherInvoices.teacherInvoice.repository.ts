import { GetCurrentTeacherInvoicesQueryResult } from './getCurrentTeacherInvoices.queryResult';

export interface GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    getByUserId(userId: number): Promise<GetCurrentTeacherInvoicesQueryResult>;
}