import { CreateTeacherInvoiceDateTimeProvider } from "../createTeacherInvoice.dateTimeProvider";

export class DeterministicDateTimeProvider implements CreateTeacherInvoiceDateTimeProvider {
    constructor(private readonly fixedDate: Date) {}

    now(): Date {
        return this.fixedDate;
    }
}
