import { ValidateTeacherInvoiceRepository } from '../validateTeacherInvoice.repository';
import { TeacherInvoice } from '../../createTeacherInvoice/teacherInvoice.entity';

export class ValidateTeacherInvoiceFailureInMemoryRepository implements ValidateTeacherInvoiceRepository {
    private invoices: TeacherInvoice[] = [];

    seed(invoiceData: any): void {
        const invoice = new TeacherInvoice(
            invoiceData.teacher || { id: 1, firstName: 'David', lastName: 'Robert' },
            invoiceData.amount,
            invoiceData.pdfFile || 'test.pdf',
            invoiceData.creationDate || new Date(),
            invoiceData.dueDate || '31/12/2024'
        );
        invoice.id = invoiceData.id;
        invoice.status = invoiceData.status;
        invoice.validatedAt = invoiceData.validatedAt;
        this.invoices.push(invoice);
    }

    async findById(id: number): Promise<TeacherInvoice | null> {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        throw new Error("Database error");
    }
}