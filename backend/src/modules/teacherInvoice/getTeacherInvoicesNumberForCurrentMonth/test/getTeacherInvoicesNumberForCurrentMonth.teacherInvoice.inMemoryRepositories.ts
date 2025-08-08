import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from '../getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';
import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from '../getTeacherInvoicesNumberForCurrentMonth.queryResult';

export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
  async getTeacherInvoicesNumberForCurrentMonth(teacherId: number): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    return { number: 2 };
  }
}

export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
  async getTeacherInvoicesNumberForCurrentMonth(teacherId: number): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    throw new Error('Database connection failed');
  }
}