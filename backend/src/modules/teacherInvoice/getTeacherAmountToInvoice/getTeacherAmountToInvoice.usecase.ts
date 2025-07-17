import { Inject } from "@nestjs/common";
import { GetTeacherAmountToInvoiceRepository } from "./getTeacherAmountToInvoice.repository";
import { GetTeacherAmountToInvoiceTypeOrmRepository } from "./getTeacherAmountToInvoice.typeOrmRepository";
import { GetTeacherAmountToInvoiceQueryResult } from "./getTeacherAmountToInvoice.queryResult";

export class GetTeacherAmountToInvoiceUsecase {
    constructor(
        @Inject(GetTeacherAmountToInvoiceTypeOrmRepository)
        private getTeacherAmountToInvoiceRepository: GetTeacherAmountToInvoiceRepository
    ) {}
    async execute(teacherId: number): Promise<GetTeacherAmountToInvoiceQueryResult> {

        let result: GetTeacherAmountToInvoiceQueryResult | null;

        try {
            result = await this.getTeacherAmountToInvoiceRepository.findTeacherAmountToInvoiceById(teacherId);
        } catch (err) {
            throw new Error('Erreur lors de la récupération du montant à facturer du professeur.');
        }

        if (!result) {
            throw new Error('Professeur non trouvé.');
        }

        return result;
    }
}
