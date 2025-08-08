export class CreateTeacherInvoiceCommand {
    constructor(
        public readonly teacherId: number,
        public readonly amount: number,
        public readonly pdfFileContent: Buffer,
    ) {}
}
