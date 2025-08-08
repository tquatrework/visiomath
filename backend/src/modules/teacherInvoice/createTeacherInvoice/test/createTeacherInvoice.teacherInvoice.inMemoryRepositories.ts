import { CreateTeacherInvoiceTeacherInvoiceRepository } from '../createTeacherInvoice.teacherInvoice.repository';
import { TeacherInvoice } from '../teacherInvoice.entity';

export class CreateTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository implements CreateTeacherInvoiceTeacherInvoiceRepository {
  public createdInvoice: TeacherInvoice | null = null;
  private invoices: TeacherInvoice[] = [];

  seedInvoice(invoice: TeacherInvoice): void {
    this.invoices.push(invoice);
  }

  async save(teacherInvoice: TeacherInvoice): Promise<void> {
    teacherInvoice.id = Math.floor(Math.random() * 1000) + 1;
    this.createdInvoice = teacherInvoice;
    this.invoices.push(teacherInvoice);
  }
}

export class CreateTeacherInvoiceTeacherInvoiceFailureInMemoryRepository implements CreateTeacherInvoiceTeacherInvoiceRepository {
  public createdInvoice: TeacherInvoice | null = null;

  async save(teacherInvoice: TeacherInvoice): Promise<void> {
    throw new Error('Database save failed');
  }
}