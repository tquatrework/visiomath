import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from '../getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';
import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from '../getTeacherInvoicesNumberForCurrentMonth.queryResult';

export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
  async getTeacherInvoicesNumberForCurrentMonth(): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    throw new Error('Vous ne pouvez pas effectuer cette opération');
  }
}