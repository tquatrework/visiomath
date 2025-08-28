import {beforeEach, describe, expect, test} from "vitest";
import {GetTeacherPaymentInfoUsecase} from "../getTeacherPaymentInfo.usecase";
import {
    GetTeacherPaymentInfoUserSuccessInMemoryRepository,
    GetTeacherPaymentInfoUserNotFoundInMemoryRepository
} from "./getTeacherPaymentInfo.user.inMemoryRepositories";
import {
    GetTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository,
    GetTeacherPaymentInfoTeacherPaymentInfoFailureInMemoryRepository
} from "./getTeacherPaymentInfo.teacherPaymentInfo.inMemoryRepositories";
import {GetTeacherPaymentInfoQueryResult} from "../getTeacherPaymentInfo.queryResult";
import {CompanyType} from "../../../../shared/entities/teacherProfile.entity";
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

describe('#US-2: Récupération des informations bancaires du professeur', () => {

    test('#US-2-AC-1: Récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec ces informations bancaires stockées
        const user = generateUserWithTeacherProfile(1);
        const expectedPaymentInfo: GetTeacherPaymentInfoQueryResult = {
            companyName: "ProfCompany",
            siret: "12345678912345",
            companyType: CompanyType.Autoentrepreneur,
            subjectToVat: true,
            iban: "FR1234567891234567891234567",
            bic: "azertyaz"
        };

        const getTeacherPaymentInfoUserRepository = new GetTeacherPaymentInfoUserSuccessInMemoryRepository();
        const getTeacherPaymentInfoTeacherPaymentInfoRepository = new GetTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();
        const getTeacherPaymentInfoUsecase = new GetTeacherPaymentInfoUsecase(
            getTeacherPaymentInfoUserRepository,
            getTeacherPaymentInfoTeacherPaymentInfoRepository
        );

        getTeacherPaymentInfoUserRepository.seed({ id: user.id, role: user.role });
        getTeacherPaymentInfoTeacherPaymentInfoRepository.seed(1, expectedPaymentInfo);

        // Quand je récupère mes informations bancaire
        const result = await getTeacherPaymentInfoUsecase.execute(1);

        // Alors je dois voir mes informations bancaires
        expect(result).toEqual(expectedPaymentInfo);

    })

    test('#US-2-AC-2: Récupération échouée', async () => {

        // Etant donné que je suis connecté en tant que professeur avec ces informations de paiement stockées
        // mais que la récupération va échouer
        const user = generateUserWithTeacherProfile(1);
        const getTeacherPaymentInfoUserRepository = new GetTeacherPaymentInfoUserSuccessInMemoryRepository();
        const getTeacherPaymentInfoTeacherPaymentInfoFailureRepository = new GetTeacherPaymentInfoTeacherPaymentInfoFailureInMemoryRepository();
        const getTeacherPaymentInfoUsecaseWithFailure = new GetTeacherPaymentInfoUsecase(
            getTeacherPaymentInfoUserRepository,
            getTeacherPaymentInfoTeacherPaymentInfoFailureRepository
        );
        
        getTeacherPaymentInfoUserRepository.seed({ id: user.id, role: user.role });
        
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
        const getTeacherPaymentInfoUserNotFoundRepository = new GetTeacherPaymentInfoUserNotFoundInMemoryRepository();
        const getTeacherPaymentInfoTeacherPaymentInfoRepository = new GetTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository();
        const getTeacherPaymentInfoUsecase = new GetTeacherPaymentInfoUsecase(
            getTeacherPaymentInfoUserNotFoundRepository,
            getTeacherPaymentInfoTeacherPaymentInfoRepository
        );

        // Quand je récupère mes informations bancaire
        // Alors une erreur "Professeur non trouvé" doit être affichée
        await expect(
            getTeacherPaymentInfoUsecase.execute(999)
        ).rejects.toThrow("Professeur non trouvé");

    })

})
