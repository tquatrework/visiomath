import {beforeEach, expect} from "vitest";
import {SaveTeacherPaymentInfoUsecase} from "./saveTeacherPaymentInfo.usecase";
import {User} from "../../../shared/entities/user.entity";
import {UserProfile} from "../../../shared/entities/userprofile.entity";
import {UserInMemoryRepository} from "../../users/user.inMemoryRepository";
import {TeacherProfile} from "../../../shared/entities/teacherProfile.entity";


const generateUserWithTeacherProfile = (userId: number) => {
    const user = new User();
    user.id = userId;

    const userProfile = new UserProfile();
    userProfile.id = 1;
    user.userProfile = userProfile;

    const teacherProfile = new TeacherProfile();
    teacherProfile.id = 1;
    userProfile.teacherProfile = teacherProfile;

    return user;
}

describe('#US-1: Enregistrement des informations personnelles / de paiement du professeur', () => {

    test('#US-1-AC-1: Enregistrement réussi', async () => {
        //Etant donné que je suis connecté en tant que professeur

        const user = generateUserWithTeacherProfile(1);

        const userInMemoryRepository = new UserInMemoryRepository();
        userInMemoryRepository.seed(user)

        /**Quand j’enregistre :
         nom de l’entreprise : “ProfCompany”
         siret : “12345678912345
         type entreprise : AE
         assujetti TVA : non
         IBAN : FR 1234567891234567891234567
         Bic : azertyaz
         */
        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: "AE",
            vatExempt: true,
            iban: "FR1234567891234567891234567",
            bic: "azerty33"
        }

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(userInMemoryRepository);

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
        //Alors mon enregistrement doit être confirmé
        ).resolves.not.toThrow();
    });





});
