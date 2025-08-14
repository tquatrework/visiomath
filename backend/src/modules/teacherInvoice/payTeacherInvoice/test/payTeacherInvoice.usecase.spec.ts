import {describe, expect, test} from "vitest";
import {PayTeacherInvoiceUsecase} from "../payTeacherInvoice.usecase";
import {PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository, PayTeacherInvoiceTeacherInvoiceNotFoundInMemoryRepository, PayTeacherInvoiceTeacherInvoiceFailureInMemoryRepository} from "./payTeacherInvoice.teacherInvoice.inMemoryRepositories";
import {PayTeacherInvoiceUserSuccessInMemoryRepository, PayTeacherInvoiceUserFailureInMemoryRepository, PayTeacherInvoiceUserTeacherInMemoryRepository} from "./payTeacherInvoice.user.inMemoryRepositories";
import { TeacherInvoiceStatus } from "../../createTeacherInvoice/teacherInvoice.entity";

describe('US-11: Paiement de la facture', () => {

    test('US-11-AC-1: Paiement réussi', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600 € avec un id de 1 et un solde à facturer de 700e
        const payTeacherInvoiceUserSuccessInMemoryRepository = new PayTeacherInvoiceUserSuccessInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 700,
            amount: 600,
            status: TeacherInvoiceStatus.VALIDEE,
            paidAt: null
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserSuccessInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository
        );

        // Quand je veux payer la facture 1
        await payTeacherInvoiceUsecase.execute(1, { teacherInvoiceId: 1 });

        // Alors la facture doit avoir le statut "payée" et une date de paiement doit être enregistrée, et le solde du professeur doit être diminué du montant correspondant
        const updatedTeacherInvoice = await payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.findById(1);
        
        expect(updatedTeacherInvoice!.status).toBe(TeacherInvoiceStatus.PAYEE);
        expect(updatedTeacherInvoice!.paidAt).toBeDefined();
        expect(updatedTeacherInvoice!.teacher.userProfile.teacherProfile!.amountToInvoice).toBe(100);

    })

    test('US-11-AC-2: paiement échoué — erreur lors de la récupération', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600 € avec un id de 1 et un solde à facturer de 700e
        const payTeacherInvoiceUserSuccessInMemoryRepository = new PayTeacherInvoiceUserSuccessInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceNotFoundInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceNotFoundInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceNotFoundInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 700,
            amount: 600,
            status: TeacherInvoiceStatus.VALIDEE,
            paidAt: null
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserSuccessInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceNotFoundInMemoryRepository
        );

        // Quand je veux payer la facture 999, si la facture n'est pas trouvée
        // Alors je dois recevoir une erreur "La récupération de la facture a échoué" et le solde du professeur doit toujours être de 700e
        await expect(payTeacherInvoiceUsecase.execute(1, { teacherInvoiceId: 999 })).rejects.toThrow("La récupération de la facture a échoué");
        
        const unchangedTeacherInvoice = payTeacherInvoiceTeacherInvoiceNotFoundInMemoryRepository.getSeededInvoice(1);
        expect(unchangedTeacherInvoice!.teacher.userProfile.teacherProfile!.amountToInvoice).toBe(700);

    })

    test('US-11-AC-3: paiement échoué — erreur lors de l\'enregistrement', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600 € avec un id de 1
        const payTeacherInvoiceUserSuccessInMemoryRepository = new PayTeacherInvoiceUserSuccessInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceFailureInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceFailureInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceFailureInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 700,
            amount: 600,
            status: TeacherInvoiceStatus.VALIDEE,
            paidAt: null
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserSuccessInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceFailureInMemoryRepository
        );

        // Quand je veux payer la facture 1, si l'enregistrement échoue
        // Alors je dois recevoir une erreur "L'enregistrement de la facture a échoué" et le solde du professeur doit toujours être de 700e
        await expect(payTeacherInvoiceUsecase.execute(1, { teacherInvoiceId: 1 })).rejects.toThrow("L'enregistrement de la facture a échoué");
        
        const unchangedTeacherInvoice = payTeacherInvoiceTeacherInvoiceFailureInMemoryRepository.getSeededInvoice(1);
    })

    test('US-11-AC-4: paiement échoué — responsable financier non connecté', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600 € avec un id de 1
        const payTeacherInvoiceUserFailureInMemoryRepository = new PayTeacherInvoiceUserFailureInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 700,
            amount: 600,
            status: TeacherInvoiceStatus.VALIDEE,
            paidAt: null
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserFailureInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository
        );

        // Quand je veux payer la facture 1, si je ne suis plus reconnu par le système
        // Alors je dois recevoir une erreur "Responsable financier non trouvé" et le solde du professeur doit toujours être de 700e
        await expect(payTeacherInvoiceUsecase.execute(999, { teacherInvoiceId: 1 })).rejects.toThrow("Responsable financier non trouvé");
        
        const unchangedTeacherInvoice = payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.getSeededInvoice(1);
        expect(unchangedTeacherInvoice!.teacher.userProfile.teacherProfile!.amountToInvoice).toBe(700);

    })

    test('US-11-AC-5: paiement échoué — utilisateur pas responsable financier', async () => {

        // Étant donné que je suis connecté en tant que professeur et que le professeur David Robert a une facture de 600 € avec un id de 1
        const payTeacherInvoiceUserTeacherInMemoryRepository = new PayTeacherInvoiceUserTeacherInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 700,
            amount: 600,
            status: TeacherInvoiceStatus.VALIDEE,
            paidAt: null
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserTeacherInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository
        );

        // Quand je veux payer la facture 1
        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération" et le solde du professeur doit toujours être de 700e
        await expect(payTeacherInvoiceUsecase.execute(1, { teacherInvoiceId: 1 })).rejects.toThrow("Vous ne pouvez pas effectuer cette opération");
        
        const unchangedTeacherInvoice = payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.getSeededInvoice(1);
        expect(unchangedTeacherInvoice!.teacher.userProfile.teacherProfile!.amountToInvoice).toBe(700);

    })

    test('US-11-AC-6: paiement échoué — facture déjà payée', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture déjà payée de 600 € avec un id de 1
        const payTeacherInvoiceUserSuccessInMemoryRepository = new PayTeacherInvoiceUserSuccessInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 700,
            amount: 600,
            status: TeacherInvoiceStatus.PAYEE,
            paidAt: new Date()
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserSuccessInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository
        );

        // Quand je veux payer la facture 1
        // Alors je dois recevoir une erreur "La facture a déjà été payée" et le solde du professeur doit toujours être de 700e
        await expect(payTeacherInvoiceUsecase.execute(1, { teacherInvoiceId: 1 })).rejects.toThrow("La facture a déjà été payée");
        
        const unchangedTeacherInvoice = payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.getSeededInvoice(1);
        expect(unchangedTeacherInvoice!.teacher.userProfile.teacherProfile!.amountToInvoice).toBe(700);

    })

    test('US-11-AC-7: paiement échoué — facture refusée', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture annulée de 600 € avec un id de 1
        const payTeacherInvoiceUserSuccessInMemoryRepository = new PayTeacherInvoiceUserSuccessInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 700,
            amount: 600,
            status: TeacherInvoiceStatus.REFUSEE,
            paidAt: null
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserSuccessInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository
        );

        // Quand je veux payer la facture 1
        // Alors je dois recevoir une erreur "La facture est refusée et ne peut pas être payée" et le solde du professeur doit toujours être de 700e
        await expect(payTeacherInvoiceUsecase.execute(1, { teacherInvoiceId: 1 })).rejects.toThrow("La facture est refusée et ne peut pas être payée");
        
        const unchangedTeacherInvoice = payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.getSeededInvoice(1);
        expect(unchangedTeacherInvoice!.teacher.userProfile.teacherProfile!.amountToInvoice).toBe(700);

    })

    test('US-11-AC-8: refus échoué : solde du professeur inférieur à la facture', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture validée de 600 € avec un id de 1 et qu'il a un solde à facturer de 500e
        const payTeacherInvoiceUserSuccessInMemoryRepository = new PayTeacherInvoiceUserSuccessInMemoryRepository();
        const payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository = new PayTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository();
        
        payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.seed({
            id: 1,
            teacherId: 1,
            teacherFirstName: 'David',
            teacherLastName: 'Robert',
            teacherAmountToInvoice: 500,
            amount: 600,
            status: TeacherInvoiceStatus.VALIDEE,
            paidAt: null
        });
        
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(
            payTeacherInvoiceUserSuccessInMemoryRepository,
            payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository
        );

        // Quand je veux payer la facture 1
        // Alors je dois recevoir une erreur "Le solde du professeur à facturer est inférieur au montant de la facture" et le solde du professeur doit toujours être de 500e
        await expect(payTeacherInvoiceUsecase.execute(1, { teacherInvoiceId: 1 })).rejects.toThrow("le solde à facturer doit être supérieur au montant de la facture");
        
        const unchangedTeacherInvoice = payTeacherInvoiceTeacherInvoiceSuccessInMemoryRepository.getSeededInvoice(1);
        expect(unchangedTeacherInvoice!.teacher.userProfile.teacherProfile!.amountToInvoice).toBe(500);

    })

})