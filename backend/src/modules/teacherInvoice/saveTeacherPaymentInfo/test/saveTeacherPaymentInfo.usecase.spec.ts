import {beforeEach, expect} from "vitest";
import {TeacherProfile} from "../../../../shared/entities/teacherProfile.entity";
import {UserProfile} from "../../../../shared/entities/userprofile.entity";
import {User} from "../../../../shared/entities/user.entity";
import {SaveTeacherPaymentInfoUsecase} from "../saveTeacherPaymentInfo.usecase";
import {SaveTeacherPaymentInfoInMemoryRepository} from "./saveTeacherPaymentInfo.inMemoryRepository";



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

        const saveTeacherPaymentInfoInMemoryRepository = new SaveTeacherPaymentInfoInMemoryRepository();
        saveTeacherPaymentInfoInMemoryRepository.seed(user)

        /**Quand j’enregistre :
         nom de l’entreprise : “ProfCompany”
         siret : “12345678912345"
         type entreprise : Autoentrepreneur
         assujetti TVA : non
         IBAN : FR123456789012AZ67891234567
         Bic : azertyaz
         */
        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: "Autoentrepreneur",
            subjectToVat: true,
            iban: "FR123456789012AZ67891234567",
            bic: "azerty33"
        }

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(saveTeacherPaymentInfoInMemoryRepository);

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
        //Alors mon enregistrement doit être confirmé
        ).resolves.not.toThrow();
    });


    test('#US-1-AC-2: Enregistrement échoué avec SIRET de moins de 14 caractères', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoInMemoryRepository = new SaveTeacherPaymentInfoInMemoryRepository();
        saveTeacherPaymentInfoInMemoryRepository.seed(user)


        /**Quand j’enregistre :
         nom de l’entreprise : “ProfCompany”
         Siret : “123456789123"
         type entreprise : Autoentrepreneur
         assujetti TVA : non
         IBAN : FR123456789012AZ67891234567
         Bic : azertyaz
         */

        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "123456789123",
            companyType: "Autoentrepreneur",
            subjectToVat: true,
            iban: "FR123456789012AZ67891234567",
            bic: "azertyaz"
        };

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(saveTeacherPaymentInfoInMemoryRepository);

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
            //Alors mon enregistrement doit renvoyer une erreur “Le SIRET doit contenir 14 caractères”
        ).rejects.toThrow("Le SIRET doit contenir 14 caractères.");

    });


    test('#US-1-AC-3: Enregistrement échoué avec type d’entreprise non autorisé', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoInMemoryRepository = new SaveTeacherPaymentInfoInMemoryRepository();
        saveTeacherPaymentInfoInMemoryRepository.seed(user)

        /**Quand j’enregistre :
         nom de l’entreprise : “ProfCompany”
         siret : “12345678912345
         type entreprise : test
         assujetti TVA : non
         IBAN : FR123456789012AZ67891234567
         Bic : azertyaz
         */
        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: "test",
            subjectToVat: true,
            iban: "FR123456789012AZ67891234567",
            bic: "azertyaz"
        };

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(saveTeacherPaymentInfoInMemoryRepository);

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)

            //Alors mon enregistrement doit renvoyer une erreur “Ce type d’entreprise n’existe pas”
        ).rejects.toThrow("Le type d’entreprise n’est pas valide");
    });

    test('#US-1-AC-4: Enregistrement échoué – professeur non trouvé', async () => {
        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoInMemoryRepository = new SaveTeacherPaymentInfoInMemoryRepository();
        saveTeacherPaymentInfoInMemoryRepository.seed(user)
        /**Quand j’enregistre :
         nom de l’entreprise : “ProfCompany”
         siret : “12345678912345
         type entreprise : Autoentrepreneur
         assujetti TVA : non
         IBAN : FR123456789012AZ67891234567
         Bic : azertyaz
         */
        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: "Autoentrepreneur",
            subjectToVat: true,
            iban: "FR123456789012AZ67891234567",
            bic: "azertyaz"
        };

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(saveTeacherPaymentInfoInMemoryRepository);

        await expect(
            saveTeacherPaymentInfoUseCase.execute(999, saveTeacherPaymentInfoCommand)
            //Alors mon enregistrement doit renvoyer une erreur “Professeur introuvable”
        ).rejects.toThrow("Professeur introuvable.");
    });


    test('#US-1-AC-5: Enregistrement échoué – IBAN invalide', async () => {
        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoInMemoryRepository = new SaveTeacherPaymentInfoInMemoryRepository();
        saveTeacherPaymentInfoInMemoryRepository.seed(user)

        //  Quand j’enregistre:
        //    nom de l’entreprise : « ProfCompany »
        //    siret : « 12345678912345 »
        //    type entreprise : Autoentrepreneur
        //    assujetti TVA : non
        //    IBAN : « FRA23456789012AZ67891234567 »
        //    BIC : « azertyaz »
        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: "Autoentrepreneur",
            subjectToVat: true,
            iban: "FRA23456789012AZ67891234567", // IBAN invalide
            bic: "azertyaz"
        };

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(saveTeacherPaymentInfoInMemoryRepository);

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
        ).rejects.toThrow("L’IBAN doit commencer par 2 lettres suivies de 12 chiffres suivies de 13 caractères alphanumériques.");
    });


    test('#US-1-AC-6: Enregistrement échoué – BIC invalide', async () => {
        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoInMemoryRepository = new SaveTeacherPaymentInfoInMemoryRepository();
        saveTeacherPaymentInfoInMemoryRepository.seed(user)

        //  Quand j’enregistre:
        //    nom de l’entreprise : « ProfCompany »
        //    siret : « 12345678912345 »
        //    type entreprise : Autoentrepreneur
        //    assujetti TVA : non
        //    IBAN : « FR123456789012AZ67891234567 »
        //    BIC : « abc12 » (BIC invalide)
        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: "Autoentrepreneur",
            subjectToVat: true,
            iban: "FR123456789012AZ67891234567",
            bic: "abc12" // BIC invalide
        };

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(saveTeacherPaymentInfoInMemoryRepository);

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
            //Alors mon enregistrement doit renvoyer une erreur “Le BIC doit contenir 6 lettres suivies de 2 ou 5 caractères alphanumériques.”
        ).rejects.toThrow("Le BIC doit contenir 6 lettres suivies de 2 ou 5 caractères alphanumériques.");
    });

});
