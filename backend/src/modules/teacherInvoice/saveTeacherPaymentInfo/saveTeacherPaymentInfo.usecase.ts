import {Inject} from "@nestjs/common";
import {SaveTeacherPaymentInfoRepository} from "./saveTeacherPaymentInfo.repository";
import {SaveTeacherPaymentInfoTypeOrmRepository} from "./saveTeacherPaymentInfo.typeOrmRepository";
import {AddTeacherPaymentInfoCommand} from "../../../shared/entities/teacherProfile.entity";

export class SaveTeacherPaymentInfoUsecase {

    constructor(
        @Inject(SaveTeacherPaymentInfoTypeOrmRepository)
        private saveTeacherPaymentInfoRepository: SaveTeacherPaymentInfoRepository
    ) {}

    async execute(teacherId: number, saveTeacherPaymentInfoCommand: AddTeacherPaymentInfoCommand) {

        const teacher = await this.saveTeacherPaymentInfoRepository.findUserByIdWithTeacherProfil(teacherId);

        if (!teacher) {
            throw new Error("Professeur introuvable.");
        }

        teacher.addTeacherProfilPaymentInfo(saveTeacherPaymentInfoCommand);

        try {
            await this.saveTeacherPaymentInfoRepository.save(teacher);
            return;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Erreur lors de l'enregistrement des informations de paiement du professeur.");
            }
            throw new Error("Erreur interne du serveur.");
        }

    }
}