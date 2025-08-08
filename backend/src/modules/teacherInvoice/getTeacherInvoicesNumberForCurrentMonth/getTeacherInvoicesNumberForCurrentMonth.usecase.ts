import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from './getTeacherInvoicesNumberForCurrentMonth.queryResult';
import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from './getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';

export class GetTeacherInvoicesNumberForCurrentMonthUsecase {
  constructor(
    private readonly getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository: GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository
  ) {}

  async execute(userId: string): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    try {
      return await this.getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository.getTeacherInvoicesNumberForCurrentMonth(userId);
    } catch (error) {
      throw new Error("Il y a eu un problème lors de la récupération des factures pour le mois en cours");
    }
  }
}