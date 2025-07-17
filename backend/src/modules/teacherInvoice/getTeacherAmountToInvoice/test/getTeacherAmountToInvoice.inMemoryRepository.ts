import { GetTeacherAmountToInvoiceRepository } from "../getTeacherAmountToInvoice.repository";
import { GetTeacherAmountToInvoiceQueryResult } from "../getTeacherAmountToInvoice.queryResult";

export class GetTeacherAmountToInvoiceInMemoryRepository implements GetTeacherAmountToInvoiceRepository {
    private teacherAmounts: Map<number, number> = new Map();

    async findTeacherAmountToInvoiceById(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult | null> {

        const amountToInvoice = this.teacherAmounts.get(teacherId);

        if (amountToInvoice === undefined) {
            return null;
        }

        return {
            amountToInvoice: amountToInvoice
        }

    }

    seed(teacherId: number, amount: number): void {
        this.teacherAmounts.set(teacherId, amount);
    }
}
