import {Injectable, Inject} from "@nestjs/common";
import {SaveTeacherPaymentInfoTeacherPaymentInfoRepository} from "./saveTeacherPaymentInfo.teacherPaymentInfo.repository";
import {SaveTeacherPaymentInfoUserRepository} from "./saveTeacherPaymentInfo.user.repository";
import {SaveTeacherPaymentInfoUserTypeOrmRepository} from "./saveTeacherPaymentInfo.user.typeOrmRepository";
import {SaveTeacherPaymentInfoTeacherPaymentInfoTypeOrmRepository} from "./saveTeacherPaymentInfo.teacherPaymentInfo.typeOrmRepository";
import {AddTeacherPaymentInfoCommand} from "../../../shared/entities/teacherProfile.entity";

@Injectable()
export class SaveTeacherPaymentInfoUsecase {

    constructor(
        @Inject(SaveTeacherPaymentInfoUserTypeOrmRepository)
        private saveTeacherPaymentInfoUserRepository: SaveTeacherPaymentInfoUserRepository,
        @Inject(SaveTeacherPaymentInfoTeacherPaymentInfoTypeOrmRepository)
        private saveTeacherPaymentInfoTeacherPaymentInfoRepository: SaveTeacherPaymentInfoTeacherPaymentInfoRepository
    ) {}

    async execute(teacherId: number, saveTeacherPaymentInfoCommand: AddTeacherPaymentInfoCommand) {

        const user = await this.saveTeacherPaymentInfoUserRepository.findUserById(teacherId);

        if (!user) {
            throw new Error("Professeur introuvable.");
        }

        if (user.role !== 'teacher') {
            throw new Error("Vous ne pouvez pas effectuer cette opération");
        }

        const teacher = await this.saveTeacherPaymentInfoTeacherPaymentInfoRepository.findUserByIdWithTeacherProfil(teacherId);

        if (!teacher) {
            throw new Error("Professeur introuvable.");
        }

        teacher.addTeacherProfilPaymentInfo(saveTeacherPaymentInfoCommand);

        try {
            await this.saveTeacherPaymentInfoTeacherPaymentInfoRepository.save(teacher);
            return;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Erreur lors de l'enregistrement des informations de paiement du professeur.");
            }
            throw new Error("Erreur interne du serveur.");
        }

    }
}