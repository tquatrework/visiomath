import {ViewTeacherInvoiceRepository} from "../viewTeacherInvoice.repository";
import {ViewTeacherInvoiceQueryResult, TeacherInvoiceDto} from "../viewTeacherInvoice.queryResult";

export class ViewTeacherInvoiceInMemoryRepository implements ViewTeacherInvoiceRepository {
    private invoices: TeacherInvoiceDto[] = [];
    
    setupInvoices(invoices: TeacherInvoiceDto[]): void {
        this.invoices = invoices;
    }
    
    async execute(teacherId: number): Promise<ViewTeacherInvoiceQueryResult> {
        const teacherInvoices = this.invoices.filter(invoice => invoice.teacherId === teacherId);
        return {
            invoices: teacherInvoices
        };
    }
}
