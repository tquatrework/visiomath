import { Injectable, Inject } from '@nestjs/common';
import { GetTeacherInvoicesQueryResult } from './getTeacherInvoices.queryResult';
import { GetTeacherInvoicesTypeOrmRepository } from './getTeacherInvoices.typeOrmRepository';
import { GetTeacherInvoicesUserTypeOrmRepository } from './getTeacherInvoices.userTypeOrmRepository';
import { GetTeacherInvoicesUserRepository } from './getTeacherInvoices.userRepository';
import { GetTeacherInvoicesInvoicesRepository } from './getTeacherInvoices.invoicesRepository';

@Injectable()
export class GetTeacherInvoicesUsecase {
  constructor(
    @Inject(GetTeacherInvoicesUserTypeOrmRepository)
    private readonly userRepository: GetTeacherInvoicesUserRepository,
    @Inject(GetTeacherInvoicesTypeOrmRepository)
    private readonly invoicesRepository: GetTeacherInvoicesInvoicesRepository
  ) {}

  async execute(userId: number): Promise<GetTeacherInvoicesQueryResult> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new Error('Responsable financier non trouvé');
    }

    if (user.role !== 'financial_admin') {
      throw new Error('Vous ne pouvez pas effectuer cette opération');
    }

    try {
      return await this.invoicesRepository.getTeacherInvoices();
    } catch (error) {
      throw new Error('la récupération des factures à échoué');
    }
  }
}