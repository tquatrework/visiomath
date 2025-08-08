import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from '../getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';
import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from '../getTeacherInvoicesNumberForCurrentMonth.queryResult';

export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
  async getTeacherInvoicesNumberForCurrentMonth(teacherId: string): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    throw new Error('Database connection failed');
  }
}