import { PayTeacherInvoiceTeacherInvoiceRepository } from '../payTeacherInvoice.teacherInvoice.repository';
import { TeacherInvoice } from '../../createTeacherInvoice/teacherInvoice.entity';
import { User } from '../../../../shared/entities/user.entity';
import { UserProfile } from '../../../../shared/entities/userprofile.entity';
import { TeacherProfile } from '../../../../shared/entities/teacherProfile.entity';

export class PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository implements PayTeacherInvoiceTeacherInvoiceRepository {
    private invoices: TeacherInvoice[] = [];

    seed(invoiceData: any): void {
        const teacher = new User();
        teacher.id = invoiceData.teacherId;
        teacher.firstName = invoiceData.teacherFirstName || 'David';
        teacher.lastName = invoiceData.teacherLastName || 'Robert';
        
        const userProfile = new UserProfile();
        userProfile.id = invoiceData.teacherId;
        teacher.userProfile = userProfile;
        
        const teacherProfile = new TeacherProfile();
        teacherProfile.id = invoiceData.teacherId;
        teacherProfile.amountToInvoice = invoiceData.teacherAmountToInvoice;
        userProfile.teacherProfile = teacherProfile;

        const invoice = new TeacherInvoice(
            teacher,
            invoiceData.amount,
            invoiceData.pdfFile || 'test.pdf',
            invoiceData.creationDate || new Date()
        );
        invoice.id = invoiceData.id;
        invoice.status = invoiceData.status;
        invoice.paidAt = invoiceData.paidAt;
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

    getSeededInvoice(id: number): TeacherInvoice | null {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }
}

export class PayTeacherInvoiceTeacherInvoiceNotFoundInMemoryRepository implements PayTeacherInvoiceTeacherInvoiceRepository {
    private invoices: TeacherInvoice[] = [];

    seed(invoiceData: any): void {
        const teacher = new User();
        teacher.id = invoiceData.teacherId;
        teacher.firstName = invoiceData.teacherFirstName || 'David';
        teacher.lastName = invoiceData.teacherLastName || 'Robert';
        
        const userProfile = new UserProfile();
        userProfile.id = invoiceData.teacherId;
        teacher.userProfile = userProfile;
        
        const teacherProfile = new TeacherProfile();
        teacherProfile.id = invoiceData.teacherId;
        teacherProfile.amountToInvoice = invoiceData.teacherAmountToInvoice;
        userProfile.teacherProfile = teacherProfile;

        const invoice = new TeacherInvoice(
            teacher,
            invoiceData.amount,
            invoiceData.pdfFile || 'test.pdf',
            invoiceData.creationDate || new Date()
        );
        invoice.id = invoiceData.id;
        invoice.status = invoiceData.status;
        invoice.paidAt = invoiceData.paidAt;
        this.invoices.push(invoice);
    }

    async findById(id: number): Promise<TeacherInvoice | null> {
        return null;
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        return Promise.resolve();
    }

    getSeededInvoice(id: number): TeacherInvoice | null {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }
}

export class PayTeacherInvoiceTeacherInvoiceFailureInMemoryRepository implements PayTeacherInvoiceTeacherInvoiceRepository {
    private invoices: TeacherInvoice[] = [];

    seed(invoiceData: any): void {
        const teacher = new User();
        teacher.id = invoiceData.teacherId;
        teacher.firstName = invoiceData.teacherFirstName || 'David';
        teacher.lastName = invoiceData.teacherLastName || 'Robert';
        
        const userProfile = new UserProfile();
        userProfile.id = invoiceData.teacherId;
        teacher.userProfile = userProfile;
        
        const teacherProfile = new TeacherProfile();
        teacherProfile.id = invoiceData.teacherId;
        teacherProfile.amountToInvoice = invoiceData.teacherAmountToInvoice;
        userProfile.teacherProfile = teacherProfile;

        const invoice = new TeacherInvoice(
            teacher,
            invoiceData.amount,
            invoiceData.pdfFile || 'test.pdf',
            invoiceData.creationDate || new Date()
        );
        invoice.id = invoiceData.id;
        invoice.status = invoiceData.status;
        invoice.paidAt = invoiceData.paidAt;
        this.invoices.push(invoice);
    }

    async findById(id: number): Promise<TeacherInvoice | null> {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }

    async save(invoice: TeacherInvoice): Promise<void> {
        throw new Error("L'enregistrement de la facture a échoué");
    }

    getSeededInvoice(id: number): TeacherInvoice | null {
        return this.invoices.find(invoice => invoice.id === id) || null;
    }
}