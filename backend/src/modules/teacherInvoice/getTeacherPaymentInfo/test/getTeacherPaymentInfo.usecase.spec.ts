import {beforeEach, describe, expect, test} from "vitest";
import {GetTeacherPaymentInfoUsecase} from "../getTeacherPaymentInfo.usecase";
import {GetTeacherPaymentInfoInMemoryRepository} from "./getTeacherPaymentInfo.inMemoryRepository";
import {GetTeacherPaymentInfoFailureInMemoryRepository} from "./getTeacherPaymentInfo.failureInMemoryRepository";
import {GetTeacherPaymentInfoQueryResult} from "../getTeacherPaymentInfo.queryResult";
import {CompanyType} from "../../../../shared/entities/teacherProfile.entity";

describe('#US-2: Récupération des informations bancaires du professeur', () => {

    test('#US-2-AC-1: Récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec ces informations bancaires stockées
        const expectedPaymentInfo: GetTeacherPaymentInfoQueryResult = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: CompanyType.Autoentrepreneur,
            vatExempt: true,
            iban: "FR1234567891234567891234567",
            bic: "azertyaz"
        };

        const getTeacherPaymentInfoInMemoryRepository = new GetTeacherPaymentInfoInMemoryRepository();
        const getTeacherPaymentInfoUsecase = new GetTeacherPaymentInfoUsecase(getTeacherPaymentInfoInMemoryRepository);

        getTeacherPaymentInfoInMemoryRepository.seed(1, expectedPaymentInfo);

        // Quand je récupère mes informations bancaire
        const result = await getTeacherPaymentInfoUsecase.execute(1);

        // Alors je dois voir mes informations bancaires
        expect(result).toEqual(expectedPaymentInfo);

    })

    test('#US-2-AC-2: Récupération échouée', async () => {

        // Etant donné que je suis connecté en tant que professeur avec ces informations de paiement stockées
        // mais que la récupération va échouer
        const getTeacherPaymentInfoFailureRepository = new GetTeacherPaymentInfoFailureInMemoryRepository();
        const getTeacherPaymentInfoUsecaseWithFailure = new GetTeacherPaymentInfoUsecase(getTeacherPaymentInfoFailureRepository);
        
        // Quand je récupère mes informations bancaire, si la récupération échoue
        // Alors une erreur "Impossible de récupérer les informations de paiement" doit être affichée
        await expect(
            getTeacherPaymentInfoUsecaseWithFailure.execute(1)
        ).rejects.toThrow("Impossible de récupérer les informations de paiement");

    })

    test('#US-2-AC-3: Récupération échouée - professeur non trouvé', async () => {

        // Etant donné que je ne suis pas ou plus reconnu comme professeur dans le système
        // (le repository ne retourne aucune donnée pour cet utilisateur)
        // Pas de seed dans le repository, donc aucune donnée pour l'utilisateur 999


        const expectedPaymentInfo: GetTeacherPaymentInfoQueryResult = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: CompanyType.Autoentrepreneur,
            vatExempt: true,
            iban: "FR1234567891234567891234567",
            bic: "azertyaz"
        };

        const getTeacherPaymentInfoInMemoryRepository = new GetTeacherPaymentInfoInMemoryRepository();
        const getTeacherPaymentInfoUsecase = new GetTeacherPaymentInfoUsecase(getTeacherPaymentInfoInMemoryRepository);

        // Quand je récupère mes informations bancaire
        // Alors une erreur "Professeur non trouvé" doit être affichée
        await expect(
            getTeacherPaymentInfoUsecase.execute(999)
        ).rejects.toThrow("Professeur non trouvé");

    })

})
