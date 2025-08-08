import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from '../getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';
import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from '../getTeacherInvoicesNumberForCurrentMonth.queryResult';

export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
  async getTeacherInvoicesNumberForCurrentMonth(teacherId: string): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    return { number: 2 };
  }
}