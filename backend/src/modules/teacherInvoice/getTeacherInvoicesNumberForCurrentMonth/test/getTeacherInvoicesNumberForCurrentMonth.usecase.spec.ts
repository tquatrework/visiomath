import {beforeEach, describe, expect, test} from "vitest";
import {GetTeacherInvoicesNumberForCurrentMonthUsecase} from "../getTeacherInvoicesNumberForCurrentMonth.usecase";
import {GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository} from "./getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.inMemoryRepository";
import {GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository} from "./getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.failureInMemoryRepository";

describe('US-13 : Affichage du nombre de facture du professeur pour le mois en cours', () => {

  
    test('US-13-AC-1: récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec deux factures créées pour le mois en cours
        const getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthUsecase = new GetTeacherInvoicesNumberForCurrentMonthUsecase(getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceInMemoryRepository);
        
        // Quand j'affiche le nombre de factures pour le mois en cours
        const result = await getTeacherInvoicesNumberForCurrentMonthUsecase.execute('teacher123');

        // Alors je dois recevoir "2"
        expect(result.number).toEqual(2);
        
    })

    test('US-13-AC-2: Récupération échouée : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que professeur avec deux factures créées pour le mois en cours
        const getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository = new GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository();
        const getTeacherInvoicesNumberForCurrentMonthUsecase = new GetTeacherInvoicesNumberForCurrentMonthUsecase(getTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFailureInMemoryRepository);

        await expect(
            // Quand j'affiche le nombre de factures pour le mois en cours, si la récupération des factures échoue
            getTeacherInvoicesNumberForCurrentMonthUsecase.execute('teacher123')
        // Alors je dois recevoir une erreur "Il y a eu un problème lors de la récupération des factures pour le mois en cours"
        ).rejects.toThrow("Il y a eu un problème lors de la récupération des factures pour le mois en cours");

    })

})