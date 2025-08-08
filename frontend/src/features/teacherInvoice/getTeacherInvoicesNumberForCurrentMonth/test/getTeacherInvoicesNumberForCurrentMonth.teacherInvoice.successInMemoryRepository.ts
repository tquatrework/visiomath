import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from '../getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';
import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from '../getTeacherInvoicesNumberForCurrentMonth.queryResult';

export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceSuccessInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
  async getTeacherInvoicesNumberForCurrentMonth(): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    return { number: 2 };
  }
}