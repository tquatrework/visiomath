import {Inject} from "@nestjs/common";
import {UserRepository} from "../../users/user.repository";
import {UserTypeOrmRepository} from "../../users/user.typeOrmRepository";
import {SaveTeacherPaymentInfoCommand} from "../../../shared/entities/teacherProfile.entity";

export class SaveTeacherPaymentInfoUsecase {

    constructor(
        @Inject(UserTypeOrmRepository)
        private userRepository: UserRepository
    ) {}

    async execute(teacherId: number, saveTeacherPaymentInfoCommand: SaveTeacherPaymentInfoCommand) {

        const teacher = await this.userRepository.findUserByIdWithTeacherProfil(teacherId);

        if (!teacher) {
            throw new Error("Professeur introuvable.");
        }

        teacher.addTeacherProfilPaymentInfo(saveTeacherPaymentInfoCommand);

        try {
            await this.userRepository.save(teacher);
            return;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Erreur lors de l'enregistrement des informations de paiement du professeur.");
            }
            throw new Error("Erreur interne du serveur.");
        }

    }
}