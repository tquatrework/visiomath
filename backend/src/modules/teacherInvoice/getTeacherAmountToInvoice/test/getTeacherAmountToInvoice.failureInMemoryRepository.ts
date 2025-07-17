import { GetTeacherAmountToInvoiceRepository } from "../getTeacherAmountToInvoice.repository";
import { GetTeacherAmountToInvoiceQueryResult } from "../getTeacherAmountToInvoice.queryResult";

export class GetTeacherAmountToInvoiceFailureInMemoryRepository implements GetTeacherAmountToInvoiceRepository {
    async findTeacherAmountToInvoiceById(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult | null> {
        // Simule une erreur technique (base de données, réseau, etc.)
        throw new Error("Database connection failed");
    }
}
