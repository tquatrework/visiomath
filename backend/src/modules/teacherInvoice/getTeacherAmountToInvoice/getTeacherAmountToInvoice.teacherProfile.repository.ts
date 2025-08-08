import { GetTeacherAmountToInvoiceQueryResult } from "./getTeacherAmountToInvoice.queryResult";

export interface GetTeacherAmountToInvoiceTeacherProfileRepository {
    findTeacherAmountToInvoiceById(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult | null>;
}
