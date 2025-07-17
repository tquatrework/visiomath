import { GetTeacherAmountToInvoiceQueryResult } from "./getTeacherAmountToInvoice.queryResult";

export interface GetTeacherAmountToInvoiceRepository {
    execute(): Promise<GetTeacherAmountToInvoiceQueryResult>;
}
