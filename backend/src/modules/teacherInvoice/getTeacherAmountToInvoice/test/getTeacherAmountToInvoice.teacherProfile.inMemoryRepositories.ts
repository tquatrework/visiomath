import { GetTeacherAmountToInvoiceQueryResult } from "../getTeacherAmountToInvoice.queryResult";
import {
    GetTeacherAmountToInvoiceTeacherProfileRepository
} from "../getTeacherAmountToInvoice.teacherProfile.repository";

export class GetTeacherAmountToInvoiceTeacherProfileSuccessInMemoryRepository implements GetTeacherAmountToInvoiceTeacherProfileRepository {
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

export class GetTeacherAmountToInvoiceTeacherProfileFailureInMemoryRepository implements GetTeacherAmountToInvoiceTeacherProfileRepository {
    async findTeacherAmountToInvoiceById(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult | null> {
        // Simule une erreur technique (base de données, réseau, etc.)
        throw new Error("Database connection failed");
    }
}

export class GetTeacherAmountToInvoiceTeacherProfileNotFoundInMemoryRepository implements GetTeacherAmountToInvoiceTeacherProfileRepository {
    async findTeacherAmountToInvoiceById(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult | null> {
        return null;
    }
}