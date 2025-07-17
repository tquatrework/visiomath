import {beforeEach, describe, expect, test} from "vitest";
import { GetTeacherAmountToInvoiceUsecase } from "../getTeacherAmountToInvoice.usecase";
import { GetTeacherAmountToInvoiceInMemoryRepository } from "./getTeacherAmountToInvoice.inMemoryRepository";
import { GetTeacherAmountToInvoiceFailureInMemoryRepository } from "./getTeacherAmountToInvoice.failureInMemoryRepository";

describe('#US-4: Affichage du solde à facturer du professeur', () => {

  
    test('#US-4-AC-1: Affichage du solde de 50e réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 50e
        const teacherId = 1;
        const expectedAmount = 50;
        const getTeacherAmountToInvoiceInMemoryRepository = new GetTeacherAmountToInvoiceInMemoryRepository();
        getTeacherAmountToInvoiceInMemoryRepository.seed(teacherId, expectedAmount);
        const getTeacherAmountToInvoiceUsecase = new GetTeacherAmountToInvoiceUsecase(getTeacherAmountToInvoiceInMemoryRepository);
        
        // Quand je consulte mon solde à facturer
        const result = await getTeacherAmountToInvoiceUsecase.execute(teacherId);

        // Alors je dois voir mon solde à facturer à 50e
        expect(result.amountToInvoice).toEqual(expectedAmount);
        
    })

    test('#US-4-AC-2: Affichage du solde de 50e échouée, professeur non trouvé', async () => {

        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 50e
        const teacherId = 1;
        const expectedAmount = 50;
        const getTeacherAmountToInvoiceInMemoryRepository = new GetTeacherAmountToInvoiceInMemoryRepository();
        getTeacherAmountToInvoiceInMemoryRepository.seed(teacherId, expectedAmount);
        const getTeacherAmountToInvoiceUsecase = new GetTeacherAmountToInvoiceUsecase(getTeacherAmountToInvoiceInMemoryRepository);
        
        // Quand je consulte mon solde à facturer, si je ne suis plus reconnu par le système comme professeur
        const nonExistentTeacherId = 999;

        // Alors une erreur "Professeur non trouvé" doit être affichée
        await expect(
            getTeacherAmountToInvoiceUsecase.execute(nonExistentTeacherId)
        ).rejects.toThrow("Professeur non trouvé.");
        
    })

    test('#US-4-AC-3: Affichage du solde de 50e échouée, erreur lors de la récupération du montant', async () => {

        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 50e
        const teacherId = 1;
        const getTeacherAmountToInvoiceFailureInMemoryRepository = new GetTeacherAmountToInvoiceFailureInMemoryRepository();
        const getTeacherAmountToInvoiceUsecase = new GetTeacherAmountToInvoiceUsecase(getTeacherAmountToInvoiceFailureInMemoryRepository);
        
        // Quand je consulte mon solde à facturer, si la récupération échoue pour des raisons inconnues
        
        // Alors une erreur "Erreur lors de la récupération du montant à facturer du professeur." doit être affichée
        await expect(
            getTeacherAmountToInvoiceUsecase.execute(teacherId)
        ).rejects.toThrow("Erreur lors de la récupération du montant à facturer du professeur.");
        
    })


})
