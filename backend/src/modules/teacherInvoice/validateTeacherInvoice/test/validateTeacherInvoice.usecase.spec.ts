import {beforeEach, describe, expect, test} from "vitest";
import {ValidateTeacherInvoiceUsecase} from "../validateTeacherInvoice.usecase";
import {ValidateTeacherInvoiceSuccessInMemoryRepository} from "./validateTeacherInvoice.successInMemoryRepository";
import {ValidateTeacherInvoiceFailureInMemoryRepository} from "./validateTeacherInvoice.failureInMemoryRepository";
import {ValidateTeacherInvoiceUserSuccessInMemoryRepository} from "./validateTeacherInvoice.user.successInMemoryRepository";
import {ValidateTeacherInvoiceUserFailureInMemoryRepository} from "./validateTeacherInvoice.user.failureInMemoryRepository";
import {ValidateTeacherInvoiceUserTeacherInMemoryRepository} from "./validateTeacherInvoice.user.teacherInMemoryRepository";

describe('US-9: Validation de la facture', () => {

    test('US-9-AC-1: Validation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1 et un status "en attente de validation"
        const validateTeacherInvoiceUserSuccessInMemoryRepository = new ValidateTeacherInvoiceUserSuccessInMemoryRepository();
        const validateTeacherInvoiceSuccessInMemoryRepository = new ValidateTeacherInvoiceSuccessInMemoryRepository();
        validateTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            validatedAt: null
        });
        const validateTeacherInvoiceUsecase = new ValidateTeacherInvoiceUsecase(validateTeacherInvoiceUserSuccessInMemoryRepository, validateTeacherInvoiceSuccessInMemoryRepository);
        
        // Quand je veux valider la facture 1, si tout se passe bien
        await validateTeacherInvoiceUsecase.execute(1, { invoiceId: 1 });

        // Alors la facture doit avoir le status "validée" et une date de validation
        const invoice = await validateTeacherInvoiceSuccessInMemoryRepository.findById(1);
        expect(invoice!.status).toBe('validé');
        expect(invoice!.validatedAt).toBeDefined();
        
    })

    test('Validation échouée : montant supérieur à 2500e', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 2600e avec un id de 1
        const validateTeacherInvoiceUserSuccessInMemoryRepository = new ValidateTeacherInvoiceUserSuccessInMemoryRepository();
        const validateTeacherInvoiceSuccessInMemoryRepository = new ValidateTeacherInvoiceSuccessInMemoryRepository();
        validateTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 2600,
            status: 'en attente de validation',
            validatedAt: null
        });
        const validateTeacherInvoiceUsecase = new ValidateTeacherInvoiceUsecase(validateTeacherInvoiceUserSuccessInMemoryRepository, validateTeacherInvoiceSuccessInMemoryRepository);

        // Quand je veux valider la facture 1
        // Alors je dois recevoir une erreur "La facture a un montant supérieur à 2500e"
        await expect(validateTeacherInvoiceUsecase.execute(1, { invoiceId: 1 })).rejects.toThrow("La facture a un montant supérieur à 2500e");

    })

    test('US-9-AC-3: Validation échouée : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const validateTeacherInvoiceUserSuccessInMemoryRepository = new ValidateTeacherInvoiceUserSuccessInMemoryRepository();
        const validateTeacherInvoiceSuccessInMemoryRepository = new ValidateTeacherInvoiceSuccessInMemoryRepository();
        const validateTeacherInvoiceUsecase = new ValidateTeacherInvoiceUsecase(validateTeacherInvoiceUserSuccessInMemoryRepository, validateTeacherInvoiceSuccessInMemoryRepository);

        // Quand je veux valider la facture 1, si la facture n'est pas trouvée
        // Alors je dois recevoir une erreur "la récupération de la facture à échoué"
        await expect(validateTeacherInvoiceUsecase.execute(1, { invoiceId: 999 })).rejects.toThrow("la récupération de la facture à échoué");

    })

    test('US-9-AC-4: Validation échouée : erreur lors de l\'enregistrement', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const validateTeacherInvoiceUserSuccessInMemoryRepository = new ValidateTeacherInvoiceUserSuccessInMemoryRepository();
        const validateTeacherInvoiceFailureInMemoryRepository = new ValidateTeacherInvoiceFailureInMemoryRepository();
        validateTeacherInvoiceFailureInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            validatedAt: null
        });
        const validateTeacherInvoiceUsecase = new ValidateTeacherInvoiceUsecase(validateTeacherInvoiceUserSuccessInMemoryRepository, validateTeacherInvoiceFailureInMemoryRepository);
        
        // Quand je veux valider la facture 1, si l'enregistrement échoue
        // Alors je dois recevoir une erreur "l'enregistrement de la facture à échoué"
        await expect(validateTeacherInvoiceUsecase.execute(1, { invoiceId: 1 })).rejects.toThrow("l'enregistrement de la facture à échoué");

    })

    test('US-9-AC-5: Validation échouée : responsable financier plus connecté', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const validateTeacherInvoiceUserFailureInMemoryRepository = new ValidateTeacherInvoiceUserFailureInMemoryRepository();
        const validateTeacherInvoiceSuccessInMemoryRepository = new ValidateTeacherInvoiceSuccessInMemoryRepository();
        validateTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            validatedAt: null
        });
        const validateTeacherInvoiceUsecase = new ValidateTeacherInvoiceUsecase(validateTeacherInvoiceUserFailureInMemoryRepository, validateTeacherInvoiceSuccessInMemoryRepository);
        
        // Quand je veux valider la facture 1, si je ne suis plus reconnu par le système
        // Alors je dois recevoir une erreur "Responsable financier non trouvé"
        await expect(validateTeacherInvoiceUsecase.execute(999, { invoiceId: 1 })).rejects.toThrow("Responsable financier non trouvé");

    })

    test('US-9-AC-6: Validation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1
        const validateTeacherInvoiceUserTeacherInMemoryRepository = new ValidateTeacherInvoiceUserTeacherInMemoryRepository();
        const validateTeacherInvoiceSuccessInMemoryRepository = new ValidateTeacherInvoiceSuccessInMemoryRepository();
        validateTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            status: 'en attente de validation',
            validatedAt: null
        });
        const validateTeacherInvoiceUsecase = new ValidateTeacherInvoiceUsecase(validateTeacherInvoiceUserTeacherInMemoryRepository, validateTeacherInvoiceSuccessInMemoryRepository);
        
        // Quand je veux valider la facture 1
        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        await expect(validateTeacherInvoiceUsecase.execute(1, { invoiceId: 1 })).rejects.toThrow("Vous ne pouvez pas effectuer cette opération");

    })

})