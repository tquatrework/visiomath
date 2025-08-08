import {beforeEach, describe, expect, test} from "vitest";
import {GetTeacherInvoicesNumberForCurrentMonthUsecase} from "../getTeacherInvoicesNumberForCurrentMonth.usecase";
import {
    GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository,
    GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository
} from "./getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.inMemoryRepositories";
import {
    GetTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository,
    GetTeacherInvoicesNumberForCurrentMonthUserNotFoundInMemoryRepository,
    GetTeacherInvoicesNumberForCurrentMonthUserWrongRoleInMemoryRepository
} from "./getTeacherInvoicesNumberForCurrentMonth.user.inMemoryRepositories";

describe('US-13 : Affichage du nombre de facture du professeur pour le mois en cours', () => {

  
    test('US-13-AC-1: récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec deux factures créées pour le mois en cours
        const getTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthUsecase = new GetTeacherInvoicesNumberForCurrentMonthUsecase(
            getTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository,
            getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository
        );
        
        // Quand j'affiche le nombre de factures pour le mois en cours
        const result = await getTeacherInvoicesNumberForCurrentMonthUsecase.execute(123);

        // Alors je dois recevoir "2"
        expect(result.number).toEqual(2);
        
    })

    test('US-13-AC-2: Récupération échouée : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que professeur avec deux factures créées pour le mois en cours
        const getTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthUsecase = new GetTeacherInvoicesNumberForCurrentMonthUsecase(
            getTeacherInvoicesNumberForCurrentMonthUserSuccessInMemoryRepository,
            getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository
        );

        await expect(
            // Quand j'affiche le nombre de factures pour le mois en cours, si la récupération des factures échoue
            getTeacherInvoicesNumberForCurrentMonthUsecase.execute(123)
        // Alors je dois recevoir une erreur "Il y a eu un problème lors de la récupération des factures pour le mois en cours"
        ).rejects.toThrow("Il y a eu un problème lors de la récupération des factures pour le mois en cours");

    })

    test('US-13-AC-3: Récupération échouée : professeur plus connecté', async () => {

        // Etant donné que je suis connecté en tant que professeur avec deux factures créées pour le mois en cours
        const getTeacherInvoicesNumberForCurrentMonthUserNotFoundInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthUserNotFoundInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthUsecase = new GetTeacherInvoicesNumberForCurrentMonthUsecase(
            getTeacherInvoicesNumberForCurrentMonthUserNotFoundInMemoryRepository,
            getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository
        );

        // Quand j'affiche le nombre de factures pour le mois en cours, si je ne suis plus reconnu par le système

        // Alors je dois recevoir une erreur "Professeur non trouvé"
        await expect(getTeacherInvoicesNumberForCurrentMonthUsecase.execute(123)).rejects.toThrow("Professeur non trouvé");

    })

    test('US-13-AC-4: Récupération échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const getTeacherInvoicesNumberForCurrentMonthUserWrongRoleInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthUserWrongRoleInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthUsecase = new GetTeacherInvoicesNumberForCurrentMonthUsecase(
            getTeacherInvoicesNumberForCurrentMonthUserWrongRoleInMemoryRepository,
            getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository
        );

        // Quand j'affiche le nombre de factures pour le mois en cours

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        await expect(getTeacherInvoicesNumberForCurrentMonthUsecase.execute(123)).rejects.toThrow("Vous ne pouvez pas effectuer cette opération");

    })

})