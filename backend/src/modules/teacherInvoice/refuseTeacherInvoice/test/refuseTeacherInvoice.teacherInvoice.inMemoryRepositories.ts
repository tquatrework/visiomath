import { RefuseTeacherInvoiceRepository } from '../refuseTeacherInvoice.repository';
import { TeacherInvoice, TeacherInvoiceStatus } from '../../createTeacherInvoice/teacherInvoice.entity';

export class RefuseTeacherInvoiceSuccessInMemoryRepository implements RefuseTeacherInvoiceRepository {
    private invoices: TeacherInvoice[] = [];

    seed(invoiceData: any): void {
        const invoice = new TeacherInvoice(
            invoiceData.teacher || { id: 1, firstName: 'David', lastName: 'Robert' },
            invoiceData.amount,
            invoiceData.pdfFile || 'test.pdf',
            invoiceData.creationDate || new Date()
        );
        invoice.id = invoiceData.id;
        invoice.status = invoiceData.status;
        invoice.refusedAt = invoiceData.refusedAt;
        invoice.refusalReason = invoiceData.refusalReason;
        this.invoices.push(invoice);
    }

    async findById(id: number): Promise<TeacherInvoice | null> {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        const index = this.invoices.findIndex(i => i.id === invoice.id);
        if (index !== -1) {
            this.invoices[index] = invoice;
        }
    }
}

export class RefuseTeacherInvoiceNotFoundInMemoryRepository implements RefuseTeacherInvoiceRepository {
    async findById(id: number): Promise<TeacherInvoice | null> {
        return Promise.resolve(null);
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        return Promise.resolve();
    }
}

export class RefuseTeacherInvoiceFailureInMemoryRepository implements RefuseTeacherInvoiceRepository {
    private invoices: TeacherInvoice[] = [];

    seed(invoiceData: any): void {
        const invoice = new TeacherInvoice(
            invoiceData.teacher || { id: 1, firstName: 'David', lastName: 'Robert' },
            invoiceData.amount,
            invoiceData.pdfFile || 'test.pdf',
            invoiceData.creationDate || new Date()
        );
        invoice.id = invoiceData.id;
        invoice.status = invoiceData.status;
        invoice.refusedAt = invoiceData.refusedAt;
        invoice.refusalReason = invoiceData.refusalReason;
        this.invoices.push(invoice);
    }

    async findById(id: number): Promise<TeacherInvoice | null> {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        throw new Error("l'enregistrement de la facture à échoué");
    }
}