import {describe, expect, test} from "vitest";
import {GetCurrentTeacherInvoicesUsecase} from "../getCurrentTeacherInvoices.usecase";
import {GetCurrentTeacherInvoicesTeacherInvoiceSuccessInMemoryRepository, GetCurrentTeacherInvoicesTeacherInvoiceFailureInMemoryRepository} from "./getCurrentTeacherInvoices.teacherInvoice.inMemoryRepositories";
import {GetCurrentTeacherInvoicesUserSuccessInMemoryRepository, GetCurrentTeacherInvoicesUserNotFoundInMemoryRepository, GetCurrentTeacherInvoicesUserWrongRoleInMemoryRepository} from "./getCurrentTeacherInvoices.user.inMemoryRepositories";

describe('US-12: Visualisation historique de factures pour le professeur', () => {

    test('US-12-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur "David Robert" et que j'ai une facture id 1,  validée, créée le 12/12/2023 avec un montant de 300e
        const getCurrentTeacherInvoicesUserRepository = new GetCurrentTeacherInvoicesUserSuccessInMemoryRepository();
        const getCurrentTeacherInvoicesTeacherInvoiceRepository = new GetCurrentTeacherInvoicesTeacherInvoiceSuccessInMemoryRepository();
        const getCurrentTeacherInvoicesUsecase = new GetCurrentTeacherInvoicesUsecase(getCurrentTeacherInvoicesUserRepository, getCurrentTeacherInvoicesTeacherInvoiceRepository);
        const userId = 1;
        
        // Quand je veux visualiser toutes mes factures,
        const result = await getCurrentTeacherInvoicesUsecase.execute(userId);

        // Alors je dois voir la facture id 1, validée, à 300e, créée le 12/12/2023
        expect(result.invoices).toHaveLength(1);
        expect(result.invoices[0]).toEqual({
            id: 1,
            status: "validée",
            amount: 300,
            creationDate: "12/12/2023",
            pdfFile: "invoice_1.pdf"
        });
        
    })

    test('US-12-AC-2: Visualisation échouée : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que professeur "David Robert" et que j'ai une facture id 1,  validée, créée le 12/12/2023 avec un montant de 300e
        const getCurrentTeacherInvoicesUserRepository = new GetCurrentTeacherInvoicesUserSuccessInMemoryRepository();
        const getCurrentTeacherInvoicesTeacherInvoiceRepository = new GetCurrentTeacherInvoicesTeacherInvoiceFailureInMemoryRepository();
        const getCurrentTeacherInvoicesUsecase = new GetCurrentTeacherInvoicesUsecase(getCurrentTeacherInvoicesUserRepository, getCurrentTeacherInvoicesTeacherInvoiceRepository);
        const userId = 1;

        await expect(
            // Quand je veux visualiser toutes mes factures,, si la récupération échoue
            getCurrentTeacherInvoicesUsecase.execute(userId)
        // Alors je dois recevoir une erreur "la récupération des factures à échoué"
        ).rejects.toThrow('la récupération des factures à échoué');

    })

    test('US-12-AC-3: Visualisation échouée : responsable financier plus connecté', async () => {

        // Etant donné que je suis connecté en tant que professeur "David Robert" et que j'ai une facture id 1,  validée, créée le 12/12/2023 avec un montant de 300e
        const getCurrentTeacherInvoicesUserRepository = new GetCurrentTeacherInvoicesUserNotFoundInMemoryRepository();
        const getCurrentTeacherInvoicesTeacherInvoiceRepository = new GetCurrentTeacherInvoicesTeacherInvoiceSuccessInMemoryRepository();
        const getCurrentTeacherInvoicesUsecase = new GetCurrentTeacherInvoicesUsecase(getCurrentTeacherInvoicesUserRepository, getCurrentTeacherInvoicesTeacherInvoiceRepository);
        const invalidUserId = 999;

        await expect(
            // Quand je veux visualiser toutes mes factures, si je ne suis plus reconnu par le système
            getCurrentTeacherInvoicesUsecase.execute(invalidUserId)
        // Alors je dois recevoir une erreur "Responsable financier non trouvé"
        ).rejects.toThrow('Responsable financier non trouvé');

    })

    test('US-12-AC-4: Visualisation échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que Responsable financier,
        const getCurrentTeacherInvoicesUserRepository = new GetCurrentTeacherInvoicesUserWrongRoleInMemoryRepository();
        const getCurrentTeacherInvoicesTeacherInvoiceRepository = new GetCurrentTeacherInvoicesTeacherInvoiceSuccessInMemoryRepository();
        const getCurrentTeacherInvoicesUsecase = new GetCurrentTeacherInvoicesUsecase(getCurrentTeacherInvoicesUserRepository, getCurrentTeacherInvoicesTeacherInvoiceRepository);
        const financialAdminUserId = 2;

        await expect(
            // Quand je veux visualiser toutes les factures,
            getCurrentTeacherInvoicesUsecase.execute(financialAdminUserId)
        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        ).rejects.toThrow('Vous ne pouvez pas effectuer cette opération');

    })

})