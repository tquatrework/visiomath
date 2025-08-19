export interface GetCurrentTeacherInvoicesQueryResult {
    invoices: {
        id: number;
        status: string;
        amount: number;
        creationDate: string;
        pdfFile: string;
    }[];
}