import { Inject } from '@nestjs/common';
import { GetTeacherInvoiceDetailRepository } from './getTeacherInvoiceDetail.repository';
import { GetTeacherInvoiceDetailUserRepository } from './getTeacherInvoiceDetail.user.repository';
import { GetTeacherInvoiceDetailQueryResult } from './getTeacherInvoiceDetail.queryResult';
import { GetTeacherInvoiceDetailTeacherInvoiceTypeOrmRepository } from "./getTeacherInvoiceDetail.teacherInvoice.typeOrmRepository";
import { GetTeacherInvoiceDetailUserTypeOrmRepository } from "./getTeacherInvoiceDetail.user.typeOrmRepository";

export class GetTeacherInvoiceDetailUsecase {
  constructor(
    @Inject(GetTeacherInvoiceDetailUserTypeOrmRepository)
    private readonly userRepository: GetTeacherInvoiceDetailUserRepository,
    @Inject(GetTeacherInvoiceDetailTeacherInvoiceTypeOrmRepository)
    private readonly getTeacherInvoiceDetailRepository: GetTeacherInvoiceDetailRepository
  ) {}

  async execute(userId: number, invoiceId: number): Promise<GetTeacherInvoiceDetailQueryResult> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new Error('Responsable financier non trouvé');
    }

    if (user.role !== 'financial_admin') {
      throw new Error('Vous ne pouvez pas effectuer cette opération');
    }

    try {
      return await this.getTeacherInvoiceDetailRepository.getById(invoiceId);
    } catch (error) {
      throw new Error('la récupération de la facture à échoué');
    }
  }
}