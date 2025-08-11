import {beforeEach, describe, expect, test} from "vitest";
import {RefuseTeacherInvoiceUsecase} from "../refuseTeacherInvoice.usecase";
import {RefuseTeacherInvoiceUserSuccessInMemoryRepository, RefuseTeacherInvoiceUserFailureInMemoryRepository, RefuseTeacherInvoiceUserTeacherInMemoryRepository} from "./refuseTeacherInvoice.user.inMemoryRepositories";
import {RefuseTeacherInvoiceSuccessInMemoryRepository, RefuseTeacherInvoiceNotFoundInMemoryRepository, RefuseTeacherInvoiceFailureInMemoryRepository} from "./refuseTeacherInvoice.teacherInvoice.inMemoryRepositories";
import { TeacherInvoiceStatus } from "../../createTeacherInvoice/teacherInvoice.entity";

describe('US-10: Refus de la facture', () => {

    test('US-10-AC-1: Refus réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const refuseTeacherInvoiceUserSuccessInMemoryRepository = new RefuseTeacherInvoiceUserSuccessInMemoryRepository();
        const refuseTeacherInvoiceSuccessInMemoryRepository = new RefuseTeacherInvoiceSuccessInMemoryRepository();
        refuseTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            refusedAt: null,
            refusalReason: null
        });
        const refuseTeacherInvoiceUsecase = new RefuseTeacherInvoiceUsecase(refuseTeacherInvoiceUserSuccessInMemoryRepository, refuseTeacherInvoiceSuccessInMemoryRepository);

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png" si tout se passe bien
        await refuseTeacherInvoiceUsecase.execute(1, { invoiceId: 1, refusalReason: "mauvais format de la facture : png" });

        // Alors  la facture doit avoir le status "refusée" et une date de refus
        const invoice = await refuseTeacherInvoiceSuccessInMemoryRepository.findById(1);
        expect(invoice!.status).toBe('refusée');
        expect(invoice!.refusedAt).toBeDefined();
        expect(invoice!.refusalReason).toBe('mauvais format de la facture : png');

    })

    test('US-10-AC-2: refus échoué : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const refuseTeacherInvoiceUserSuccessInMemoryRepository = new RefuseTeacherInvoiceUserSuccessInMemoryRepository();
        const refuseTeacherInvoiceNotFoundInMemoryRepository = new RefuseTeacherInvoiceNotFoundInMemoryRepository();
        const refuseTeacherInvoiceUsecase = new RefuseTeacherInvoiceUsecase(refuseTeacherInvoiceUserSuccessInMemoryRepository, refuseTeacherInvoiceNotFoundInMemoryRepository);

        // Quand je veux refuser la facture 999 avec en raison "mauvais format de la facture : png", si la facture n'est pas trouvée
        // Alors je dois recevoir une erreur "la récupération de la facture à échoué"
        await expect(refuseTeacherInvoiceUsecase.execute(1, { invoiceId: 999, refusalReason: "mauvais format de la facture : png" })).rejects.toThrow("la récupération de la facture à échoué");

    })

    test('US-10-AC-3: refus échoué : erreur lors de l\'enregistrement', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const refuseTeacherInvoiceUserSuccessInMemoryRepository = new RefuseTeacherInvoiceUserSuccessInMemoryRepository();
        const refuseTeacherInvoiceFailureInMemoryRepository = new RefuseTeacherInvoiceFailureInMemoryRepository();
        refuseTeacherInvoiceFailureInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            refusedAt: null,
            refusalReason: null
        });
        const refuseTeacherInvoiceUsecase = new RefuseTeacherInvoiceUsecase(refuseTeacherInvoiceUserSuccessInMemoryRepository, refuseTeacherInvoiceFailureInMemoryRepository);

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png", si l'enregistrement échoue
        // Alors je dois recevoir une erreur "l'enregistrement de la facture à échoué"
        await expect(refuseTeacherInvoiceUsecase.execute(1, { invoiceId: 1, refusalReason: "mauvais format de la facture : png" })).rejects.toThrow("l'enregistrement de la facture à échoué");

    })

    test('US-10-AC-4: refus échoué : responsable financier plus connecté', async () => {

        // Etant donné que je ne pas pas trouvé en tant qu'utilisateur et que le professeur David Robert a une facture de 600e avec un id de 1
        const refuseTeacherInvoiceUserFailureInMemoryRepository = new RefuseTeacherInvoiceUserFailureInMemoryRepository();
        const refuseTeacherInvoiceSuccessInMemoryRepository = new RefuseTeacherInvoiceSuccessInMemoryRepository();
        refuseTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            refusedAt: null,
            refusalReason: null
        });
        const refuseTeacherInvoiceUsecase = new RefuseTeacherInvoiceUsecase(refuseTeacherInvoiceUserFailureInMemoryRepository, refuseTeacherInvoiceSuccessInMemoryRepository);

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png"
        // Alors je dois recevoir une erreur "Responsable financier non trouvé"
        await expect(refuseTeacherInvoiceUsecase.execute(999, { invoiceId: 1, refusalReason: "mauvais format de la facture : png" })).rejects.toThrow("Responsable financier non trouvé");

    })

    test('US-10-AC-5: refus échoué : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1
        const refuseTeacherInvoiceUserTeacherInMemoryRepository = new RefuseTeacherInvoiceUserTeacherInMemoryRepository();
        const refuseTeacherInvoiceSuccessInMemoryRepository = new RefuseTeacherInvoiceSuccessInMemoryRepository();
        refuseTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            refusedAt: null,
            refusalReason: null
        });
        const refuseTeacherInvoiceUsecase = new RefuseTeacherInvoiceUsecase(refuseTeacherInvoiceUserTeacherInMemoryRepository, refuseTeacherInvoiceSuccessInMemoryRepository);

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png"
        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        await expect(refuseTeacherInvoiceUsecase.execute(1, { invoiceId: 1, refusalReason: "mauvais format de la facture : png" })).rejects.toThrow("Vous ne pouvez pas effectuer cette opération");

    })

    test('US-10-AC-6: refus échoué : facture déjà payée', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture payée de 600e avec un id de 1
        const refuseTeacherInvoiceUserSuccessInMemoryRepository = new RefuseTeacherInvoiceUserSuccessInMemoryRepository();
        const refuseTeacherInvoiceSuccessInMemoryRepository = new RefuseTeacherInvoiceSuccessInMemoryRepository();
        refuseTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: TeacherInvoiceStatus.PAYEE,
            refusedAt: null,
            refusalReason: null
        });
        const refuseTeacherInvoiceUsecase = new RefuseTeacherInvoiceUsecase(refuseTeacherInvoiceUserSuccessInMemoryRepository, refuseTeacherInvoiceSuccessInMemoryRepository);

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png"
        // Alors je dois recevoir une erreur "La facture a déjà été payée, elle ne peut plus être refusée"
        await expect(refuseTeacherInvoiceUsecase.execute(1, { invoiceId: 1, refusalReason: "mauvais format de la facture : png" })).rejects.toThrow("La facture a déjà été payée, elle ne peut plus être refusée");

    })

})