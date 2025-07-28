import {describe, expect, test} from "vitest";
import {GetTeacherInvoicesUsecase} from "../getTeacherInvoices.usecase";
import {GetTeacherInvoicesUserSuccessInMemoryRepository} from "./getTeacherInvoices.user.successInMemoryRepository";
import {GetTeacherInvoicesUserFailureInMemoryRepository} from "./getTeacherInvoices.user.failureInMemoryRepository";
import {GetTeacherInvoicesUserFailureRoleInMemoryRepository} from "./getTeacherInvoices.user.failureRoleInMemoryRepository";
import {GetTeacherInvoicesInvoicesSuccessInMemoryRepository} from "./getTeacherInvoices.invoices.successInMemoryRepository";
import {GetTeacherInvoicesInvoicesFailureInMemoryRepository} from "./getTeacherInvoices.invoices.failureInMemoryRepository";

describe('#US-7: Visualisation de la facture', () => {
  
    test('#US-7-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoicesUserSuccessInMemoryRepository();
        const invoicesRepository = new GetTeacherInvoicesInvoicesSuccessInMemoryRepository();
        const getTeacherInvoicesUsecase = new GetTeacherInvoicesUsecase(userRepository, invoicesRepository);
        
        // Quand je veux visualiser toutes les factures, si tout se passe bien
        const validUserId = 1;
        const result = await getTeacherInvoicesUsecase.execute(validUserId);

        // Alors je dois voir la facture id 1 à 600e de David Robert
        expect(result.teacherInvoices).toHaveLength(1);
        expect(result.teacherInvoices[0].id).toBe(1);
        expect(result.teacherInvoices[0].teacherName).toBe('David Robert');
        expect(result.teacherInvoices[0].amount).toBe(600);
        expect(result.teacherInvoices[0].pdfFile).toBe('invoice-1.pdf');
        expect(result.teacherInvoices[0].creationDate).toEqual(new Date('2024-01-15'));
        expect(result.teacherInvoices[0].status).toBe('en attente de validation');
        
    })

    test('#US-7-AC-2: Visualisation échouée : erreur lors de la récupération', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoicesUserSuccessInMemoryRepository();
        const invoicesRepository = new GetTeacherInvoicesInvoicesFailureInMemoryRepository();
        const getTeacherInvoicesUsecase = new GetTeacherInvoicesUsecase(userRepository, invoicesRepository);

        await expect(
            // Quand je veux visualiser toutes les factures, si la récupération échoue
            getTeacherInvoicesUsecase.execute(1)
        // Alors je dois recevoir une erreur "la récupération des factures à échoué"
        ).rejects.toThrow('la récupération des factures à échoué');

    })

    test('#US-7-AC-3: Visualisation échouée : responsable financier plus connecté', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoicesUserFailureInMemoryRepository();
        const invoicesRepository = new GetTeacherInvoicesInvoicesSuccessInMemoryRepository();
        const getTeacherInvoicesUsecase = new GetTeacherInvoicesUsecase(userRepository, invoicesRepository);
        const invalidUserId = 999;

        // Quand je veux visualiser toutes les factures, si je ne suis plus reconnu par le système
        
        // Alors je dois recevoir une erreur "Responsable financier non trouvé"
        await expect(getTeacherInvoicesUsecase.execute(invalidUserId)).rejects.toThrow('Responsable financier non trouvé');

    })

    test('#US-7-AC-4: Visualisation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1
        const userRepository = new GetTeacherInvoicesUserFailureRoleInMemoryRepository();
        const invoicesRepository = new GetTeacherInvoicesInvoicesSuccessInMemoryRepository();
        const getTeacherInvoicesUsecase = new GetTeacherInvoicesUsecase(userRepository, invoicesRepository);
        const teacherUserId = 2;

        await expect(
            // Quand je veux visualiser toutes les factures
            getTeacherInvoicesUsecase.execute(teacherUserId)
        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        ).rejects.toThrow('Vous ne pouvez pas effectuer cette opération');

    })

})