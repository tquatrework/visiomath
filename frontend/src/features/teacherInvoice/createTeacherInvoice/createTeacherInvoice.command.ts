export type CreateTeacherInvoiceCommand = {
    amount: number;
    pdfFile: File;
    dueDate: string;
}
