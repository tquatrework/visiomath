import {beforeEach, describe, expect, test} from "vitest";
import {SaveTeacherPaymentInfoUsecase} from "../saveTeacherPaymentInfo.usecase";
import {
    SaveTeacherPaymentInfoUserSuccessInMemoryRepository,
    SaveTeacherPaymentInfoUserNotFoundInMemoryRepository,
    SaveTeacherPaymentInfoUserNotTeacherInMemoryRepository
} from "./saveTeacherPaymentInfo.user.inMemoryRepositories";
import {
    SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository,
    SaveTeacherPaymentInfoTeacherPaymentInfoNotFoundInMemoryRepository,
    SaveTeacherPaymentInfoTeacherPaymentInfoFailureInMemoryRepository
} from "./saveTeacherPaymentInfo.teacherPaymentInfo.inMemoryRepositories";
import {User} from "../../../../shared/entities/user.entity";
import {UserProfile} from "../../../../shared/entities/userprofile.entity";
import {TeacherProfile} from "../../../../shared/entities/teacherProfile.entity";
import {RoleList} from "../../../../common/utils/lists.utils";


function generateUserWithTeacherProfile(id: number, role: RoleList = 'teacher'): User {
    const user = new User();
    user.id = id;
    user.role = role;
    user.userProfile = new UserProfile();
    user.userProfile.teacherProfile = new TeacherProfile();
    return user;
}


describe('#US-1: Enregistrement des informations personnelles / de paiement du professeur', () => {

    test('#US-1-AC-1: Enregistrement réussi', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);
        
        const saveTeacherPaymentInfoUserRepository = new SaveTeacherPaymentInfoUserSuccessInMemoryRepository();
        const saveTeacherPaymentInfoTeacherPaymentInfoRepository = new SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();
        
        saveTeacherPaymentInfoTeacherPaymentInfoRepository.seed(user);

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

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(
            saveTeacherPaymentInfoUserRepository,
            saveTeacherPaymentInfoTeacherPaymentInfoRepository
        );

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
        //Alors mon enregistrement doit être confirmé
        ).resolves.not.toThrow();
    });


    test('#US-1-AC-2: Enregistrement échoué avec SIRET de moins de 14 caractères', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoUserRepository = new SaveTeacherPaymentInfoUserSuccessInMemoryRepository();
        const saveTeacherPaymentInfoTeacherPaymentInfoRepository = new SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();
        
        saveTeacherPaymentInfoTeacherPaymentInfoRepository.seed(user);


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

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(
            saveTeacherPaymentInfoUserRepository,
            saveTeacherPaymentInfoTeacherPaymentInfoRepository
        );

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
            //Alors mon enregistrement doit renvoyer une erreur “Le SIRET doit contenir 14 caractères”
        ).rejects.toThrow("Le SIRET doit contenir 14 caractères.");

    });


    test('#US-1-AC-3: Enregistrement échoué avec type d\'entreprise non autorisé', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoUserRepository = new SaveTeacherPaymentInfoUserSuccessInMemoryRepository();
        const saveTeacherPaymentInfoTeacherPaymentInfoRepository = new SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();
        
        saveTeacherPaymentInfoTeacherPaymentInfoRepository.seed(user);

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

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(
            saveTeacherPaymentInfoUserRepository,
            saveTeacherPaymentInfoTeacherPaymentInfoRepository
        );

        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)

            //Alors mon enregistrement doit renvoyer une erreur "Ce type d'entreprise n'existe pas"
        ).rejects.toThrow("Le type d’entreprise n’est pas valide.");
    });

    test('#US-1-AC-4: Enregistrement échoué – professeur non trouvé', async () => {
        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoUserRepository = new SaveTeacherPaymentInfoUserSuccessInMemoryRepository();
        const saveTeacherPaymentInfoTeacherPaymentInfoRepository = new SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();

        saveTeacherPaymentInfoTeacherPaymentInfoRepository.seed(user);

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

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(
            saveTeacherPaymentInfoUserRepository,
            saveTeacherPaymentInfoTeacherPaymentInfoRepository
        );

        await expect(
            saveTeacherPaymentInfoUseCase.execute(999, saveTeacherPaymentInfoCommand)
            //Alors mon enregistrement doit renvoyer une erreur “Professeur introuvable”
        ).rejects.toThrow("Professeur introuvable.");
    });


    test('#US-1-AC-5: Enregistrement échoué – IBAN invalide', async () => {
        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoUserRepository = new SaveTeacherPaymentInfoUserSuccessInMemoryRepository();
        const saveTeacherPaymentInfoTeacherPaymentInfoRepository = new SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();

        saveTeacherPaymentInfoTeacherPaymentInfoRepository.seed(user);


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

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(
            saveTeacherPaymentInfoUserRepository,
            saveTeacherPaymentInfoTeacherPaymentInfoRepository
        );
        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
        ).rejects.toThrow("L’IBAN doit commencer par 2 lettres suivies de 12 chiffres suivies de 13 caractères alphanumériques.");
    });


    test('#US-1-AC-6: Enregistrement échoué – BIC invalide', async () => {
        //Etant donné que je suis connecté en tant que professeur
        const user = generateUserWithTeacherProfile(1);

        const saveTeacherPaymentInfoUserRepository = new SaveTeacherPaymentInfoUserSuccessInMemoryRepository();
        const saveTeacherPaymentInfoTeacherPaymentInfoRepository = new SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();

        saveTeacherPaymentInfoTeacherPaymentInfoRepository.seed(user);

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

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(
            saveTeacherPaymentInfoUserRepository,
            saveTeacherPaymentInfoTeacherPaymentInfoRepository
        );
        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
            //Alors mon enregistrement doit renvoyer une erreur “Le BIC doit contenir 6 lettres suivies de 2 ou 5 caractères alphanumériques.”
        ).rejects.toThrow("Le BIC doit contenir 6 lettres suivies de 2 ou 5 caractères alphanumériques.");
    });

    test('#US-1-AC-8: Enregistrement échoué – utilisateur pas professeur', async () => {
        //Etant donné que je suis identifié en tant que responsable financier
        const user = generateUserWithTeacherProfile(1, 'financial_admin');

        const saveTeacherPaymentInfoUserRepository = new SaveTeacherPaymentInfoUserNotTeacherInMemoryRepository();
        const saveTeacherPaymentInfoTeacherPaymentInfoRepository = new SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();
        
        saveTeacherPaymentInfoTeacherPaymentInfoRepository.seed(user);

        const saveTeacherPaymentInfoCommand = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: "Autoentrepreneur",
            subjectToVat: true,
            iban: "FR123456789012AZ67891234567",
            bic: "azertyaz"
        };

        const saveTeacherPaymentInfoUseCase = new SaveTeacherPaymentInfoUsecase(
            saveTeacherPaymentInfoUserRepository,
            saveTeacherPaymentInfoTeacherPaymentInfoRepository
        );

        //Quand je veux enregistrer mes infos
        //Alors je ne peux pas enregistrer mes infos
        await expect(
            saveTeacherPaymentInfoUseCase.execute(1, saveTeacherPaymentInfoCommand)
        ).rejects.toThrow("Vous ne pouvez pas effectuer cette opération");
    });

});
