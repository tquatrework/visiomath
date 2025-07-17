import { GetTeacherAmountToInvoiceRepository } from "../getTeacherAmountToInvoice.repository";
import { GetTeacherAmountToInvoiceQueryResult } from "../getTeacherAmountToInvoice.queryResult";

export class GetTeacherAmountToInvoiceSuccessInMemoryRepository implements GetTeacherAmountToInvoiceRepository {
    private mockData: GetTeacherAmountToInvoiceQueryResult;

    constructor(mockData: GetTeacherAmountToInvoiceQueryResult) {
        this.mockData = mockData;
    }

    async execute(): Promise<GetTeacherAmountToInvoiceQueryResult> {
        return this.mockData;
    }
}
