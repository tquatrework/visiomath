import { GetTeacherInvoicesNumberForCurrentMonthQueryResult } from './getTeacherInvoicesNumberForCurrentMonth.queryResult';
import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository } from './getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository';
import { GetTeacherInvoicesNumberForCurrentMonthUserRepository } from './getTeacherInvoicesNumberForCurrentMonth.user.repository';

export class GetTeacherInvoicesNumberForCurrentMonthUsecase {
  constructor(
    private readonly getTeacherInvoicesNumberForCurrentMonthUserRepository: GetTeacherInvoicesNumberForCurrentMonthUserRepository,
    private readonly getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository: GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository
  ) {}

  async execute(userId: number): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
    const user = await this.getTeacherInvoicesNumberForCurrentMonthUserRepository.findUserById(userId);

    if (!user) {
      throw new Error("Professeur non trouvé");
    }

    if (user.role !== 'teacher') {
      throw new Error("Vous ne pouvez pas effectuer cette opération");
    }

    try {
      return await this.getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository.getTeacherInvoicesNumberForCurrentMonth(userId);
    } catch (error) {
      throw new Error("Il y a eu un problème lors de la récupération des factures pour le mois en cours");
    }
  }
}