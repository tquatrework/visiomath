import {beforeEach, describe, expect, test} from "vitest";
import {GetTeacherInvoiceDetailUsecase} from "../getTeacherInvoiceDetail.usecase";
import {GetTeacherInvoiceDetailSuccessInMemoryRepository} from "./getTeacherInvoiceDetail.successInMemoryRepository";
import {GetTeacherInvoiceDetailFailureInMemoryRepository} from "./getTeacherInvoiceDetail.failureInMemoryRepository";
import {GetTeacherInvoiceDetailUserFailureInMemoryRepository} from "./getTeacherInvoiceDetail.user.failureInMemoryRepository";
import {GetTeacherInvoiceDetailUserSuccessInMemoryRepository} from "./getTeacherInvoiceDetail.user.successInMemoryRepository";
import {GetTeacherInvoiceDetailUserFailureRoleInMemoryRepository} from "./getTeacherInvoiceDetail.user.failureRoleInMemoryRepository";

describe('US-8: Visualisation du détail d\'une facture', () => {

  
    test('US-8-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoiceDetailUserSuccessInMemoryRepository();
        const invoiceRepository = new GetTeacherInvoiceDetailSuccessInMemoryRepository();
        const getTeacherInvoiceDetailUsecase = new GetTeacherInvoiceDetailUsecase(userRepository, invoiceRepository);
        const validUserId = 1;
        
        // Quand je veux visualiser la facture 1, si tout se passe bien
        const result = await getTeacherInvoiceDetailUsecase.execute(validUserId, 1);

        // Alors je dois voir les détails de la facture id 1 à 600e de David Robert
        expect(result.id).toBe(1);
        expect(result.teacherName).toBe('David Robert');
        expect(result.amount).toBe(600);
        expect(result.creationDate).toBeDefined();
        expect(result.pdfFile).toBeDefined();
        
    })

    test('US-8-AC-2: Visualisation échouée : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoiceDetailUserSuccessInMemoryRepository();
        const invoiceRepository = new GetTeacherInvoiceDetailFailureInMemoryRepository();
        const getTeacherInvoiceDetailUsecase = new GetTeacherInvoiceDetailUsecase(userRepository, invoiceRepository);
        const validUserId = 1;

        // Quand je veux visualiser la facture 1, si la récupération échoue
        // Alors je dois recevoir une erreur "la récupération de la facture à échoué"
        await expect(getTeacherInvoiceDetailUsecase.execute(validUserId, 1)).rejects.toThrow("la récupération de la facture à échoué");

    })

    test('US-8-AC-3: Visualisation échouée : responsable financier plus connecté', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoiceDetailUserFailureInMemoryRepository();
        const invoiceRepository = new GetTeacherInvoiceDetailSuccessInMemoryRepository();
        const getTeacherInvoiceDetailUsecase = new GetTeacherInvoiceDetailUsecase(userRepository, invoiceRepository);
        const invalidUserId = 999;

        // Quand je veux visualiser la facture 1, si je ne suis plus reconnu par le système
        // Alors je dois recevoir une erreur "Responsable financier non trouvé"
        await expect(getTeacherInvoiceDetailUsecase.execute(invalidUserId, 1)).rejects.toThrow("Responsable financier non trouvé");

    })

    test('US-8-AC-4: Visualisation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoiceDetailUserFailureRoleInMemoryRepository();
        const invoiceRepository = new GetTeacherInvoiceDetailSuccessInMemoryRepository();
        const getTeacherInvoiceDetailUsecase = new GetTeacherInvoiceDetailUsecase(userRepository, invoiceRepository);
        const teacherUserId = 2;

        // Quand je veux visualiser la facture 1
        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        await expect(getTeacherInvoiceDetailUsecase.execute(teacherUserId, 1)).rejects.toThrow("Vous ne pouvez pas effectuer cette opération");

    })

})