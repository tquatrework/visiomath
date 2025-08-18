import { GetCurrentTeacherInvoicesTeacherInvoiceRepository } from "../getCurrentTeacherInvoices.teacherInvoice.repository";
import { GetCurrentTeacherInvoicesQueryResult } from "../getCurrentTeacherInvoices.queryResult";

export class GetCurrentTeacherInvoicesSuccessInMemoryRepository implements GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    async getCurrentTeacherInvoices(): Promise<GetCurrentTeacherInvoicesQueryResult> {
        return {
            invoices: [
                {
                    id: 1,
                    status: "validée",
                    amount: 300,
                    pdfFile: "facture-david-robert.pdf",
                    creationDate: "12/12/23"
                }
            ]
        };
    }
}

export class GetCurrentTeacherInvoicesUnauthorizedInMemoryRepository implements GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    async getCurrentTeacherInvoices(): Promise<GetCurrentTeacherInvoicesQueryResult> {
        throw new Error("Vous ne pouvez pas effectuer cette opération");
    }
}