import { GetCurrentTeacherInvoicesQueryResult } from "./getCurrentTeacherInvoices.queryResult";

export interface GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    getCurrentTeacherInvoices(): Promise<GetCurrentTeacherInvoicesQueryResult>;
}