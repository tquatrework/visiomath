export class CreateTeacherInvoiceCommand {
    constructor(
        public readonly userId: number,
        public readonly amount: number,
        public readonly pdfFileContent: Buffer,
        public readonly dueDate: string,
    ) {}
}
