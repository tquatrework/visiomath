import {Inject} from "@nestjs/common";
import {IncreaseTeacherAmountToInvoiceRepository} from "./increaseTeacherAmountToInvoice.repository";
import {IncreaseTeacherAmountToInvoiceTypeOrmRepository} from "./increaseTeacherAmountToInvoice.typeOrmRepository";
import {IncreaseTeacherAmountToInvoiceCommand} from "../../../shared/entities/teacherProfile.entity";

export class IncreaseTeacherAmountToInvoiceUsecase {

    constructor(
        @Inject(IncreaseTeacherAmountToInvoiceTypeOrmRepository)
        private increaseTeacherAmountToInvoiceRepository: IncreaseTeacherAmountToInvoiceRepository
    ) {}

    async execute(teacherId: number, increaseTeacherAmountToInvoiceCommand: IncreaseTeacherAmountToInvoiceCommand) {

        const teacher = await this.increaseTeacherAmountToInvoiceRepository.findUserByIdWithTeacherProfil(teacherId);

        if (!teacher) {
            throw new Error("Professeur introuvable.");
        }

        teacher.increaseTeacherAmountToInvoice(increaseTeacherAmountToInvoiceCommand.amount);

        try {
            await this.increaseTeacherAmountToInvoiceRepository.save(teacher);
            return;
        } catch (error) {
            throw new Error("Erreur lors de l'augmentation du montant à facturer du professeur.");
        }


    }
}
