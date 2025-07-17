import { GetTeacherAmountToInvoiceQueryResult } from "./getTeacherAmountToInvoice.queryResult";

export interface GetTeacherAmountToInvoiceRepository {
    findTeacherAmountToInvoiceById(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult | null>;
}
