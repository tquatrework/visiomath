import {User} from "../../../shared/entities/user.entity";

export class CreateTeacherInvoiceCommand {
    constructor(
        public readonly teacherId: number | User,
        public readonly amount: number,
        public readonly pdfFileContent: Buffer,
    ) {}
}
