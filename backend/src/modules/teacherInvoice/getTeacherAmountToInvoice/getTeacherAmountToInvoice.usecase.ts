import { Inject } from "@nestjs/common";
import { GetTeacherAmountToInvoiceTeacherProfileTypeOrmRepository } from "./getTeacherAmountToInvoice.teacherProfile.typeOrmRepository";
import { GetTeacherAmountToInvoiceQueryResult } from "./getTeacherAmountToInvoice.queryResult";
import {GetTeacherAmountToInvoiceTeacherProfileRepository} from "./getTeacherAmountToInvoice.teacherProfile.repository";

export class GetTeacherAmountToInvoiceUsecase {
    constructor(
        @Inject(GetTeacherAmountToInvoiceTeacherProfileTypeOrmRepository)
        private getTeacherAmountToInvoiceRepository: GetTeacherAmountToInvoiceTeacherProfileRepository
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
