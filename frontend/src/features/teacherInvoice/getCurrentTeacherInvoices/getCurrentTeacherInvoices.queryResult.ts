export type GetCurrentTeacherInvoicesQueryResult = {
    invoices: TeacherInvoice[];
}

export type TeacherInvoice = {
    id: number;
    status: string;
    amount: number;
    pdfFile: string;
    creationDate: string;
}