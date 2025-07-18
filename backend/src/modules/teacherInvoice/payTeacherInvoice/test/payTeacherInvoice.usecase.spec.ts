import {beforeEach, describe, expect, test} from "vitest";
import {User} from "../../../../shared/entities/user.entity";
import {UserProfile} from "../../../../shared/entities/userprofile.entity";
import {TeacherProfile} from "../../../../shared/entities/teacherProfile.entity";
import {PayTeacherInvoiceUsecase} from "../payTeacherInvoice.usecase";
import {PayTeacherInvoiceInMemoryRepository} from "./payTeacherInvoice.inMemoryRepository";

function generateUserWithTeacherAmountToInvoice(amountToInvoice: number): User {
    const teacher = new User();
    teacher.id = 1;
    teacher.pseudo = "Thierry Quatre";
    teacher.role = "teacher";

    const userProfile = new UserProfile();
    userProfile.id = 1;
    teacher.userProfile = userProfile;

    const teacherProfile = new TeacherProfile();
    teacherProfile.id = 1;
    teacherProfile.amountToInvoice = amountToInvoice;
    userProfile.teacherProfile = teacherProfile;
    return teacher;
}

function generateUserWithFinancialAdminRole(): User {
    const financialAdmin = new User();
    financialAdmin.id = 2;
    financialAdmin.pseudo = "Admin Financier";
    financialAdmin.role = "financial_admin";

    const userProfile = new UserProfile();
    userProfile.id = 2;
    financialAdmin.userProfile = userProfile;
    
    return financialAdmin;
}

describe('#US-5: Paiement d\'une facture d\'un professeur', () => {

    test('#US-5-AC-1: Paiement réussie d\'une facture de 200e', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        // Et que le professeur Thierry Quatre a un solde à facturer de 500e
        const teacher = generateUserWithTeacherAmountToInvoice(500);
        const financialAdmin = generateUserWithFinancialAdminRole();

        const payTeacherInvoiceInMemoryRepository = new PayTeacherInvoiceInMemoryRepository();
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(payTeacherInvoiceInMemoryRepository);
        payTeacherInvoiceInMemoryRepository.seed(teacher);
        payTeacherInvoiceInMemoryRepository.seed(financialAdmin);

        // Quand je déclare que la facture 1, d'un montant de 200e, du professeur Thierry Quatre a été payée
        const payInvoiceCommand = {
            teacherId: 1,
            amount: 200
        };

        await payTeacherInvoiceUsecase.execute(financialAdmin.id, payInvoiceCommand);

        // Alors le professeur Thierry Quatre doit voir son solde à facturer diminuer de 200e
        const updatedTeacher = await payTeacherInvoiceInMemoryRepository.findUserByIdWithTeacherProfil(1);
        expect(updatedTeacher?.userProfile.teacherProfile?.amountToInvoice).toBe(300);
    })

    test('#US-5-AC-2: Diminution de 200e échouée, demandeur non responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const teacher = generateUserWithTeacherAmountToInvoice(500);
        const payTeacherInvoiceInMemoryRepository = new PayTeacherInvoiceInMemoryRepository();
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(payTeacherInvoiceInMemoryRepository);
        payTeacherInvoiceInMemoryRepository.seed(teacher);

        // Quand je déclare que la facture 1, d'un montant de 200e, du professeur Thierry Quatre a été payée
        const payInvoiceCommand = {
            teacherId: 1,
            amount: 200
        };

        // Alors une erreur "vous ne pouvez pas accéder à cette opération" doit être renvoyée
        await expect(payTeacherInvoiceUsecase.execute(teacher.id, payInvoiceCommand))
            .rejects.toThrow("vous ne pouvez pas accéder à cette opération");

    })

    test('#US-5-AC-3: Diminution de 200e échouée, demandeur non trouvée', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const teacher = generateUserWithTeacherAmountToInvoice(500);
        const payTeacherInvoiceInMemoryRepository = new PayTeacherInvoiceInMemoryRepository();
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(payTeacherInvoiceInMemoryRepository);
        payTeacherInvoiceInMemoryRepository.seed(teacher);

        // Quand je déclare que la facture 1, d'un montant de 200e, du professeur Thierry Quatre a été payée, si je ne suis plus reconnu par le système en tant que qu'utilisateur
        const payInvoiceCommand = {
            teacherId: 1,
            amount: 200
        };
        const inexistentFinancialAdminId = 999;

        // Alors une erreur "Responsable financier non trouvé" doit être renvoyée
        await expect(payTeacherInvoiceUsecase.execute(inexistentFinancialAdminId, payInvoiceCommand))
            .rejects.toThrow("Responsable financier non trouvé");

    })

    test('#US-5-AC-4: Diminution de 200e échouée, teacher non trouvée', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const financialAdmin = generateUserWithFinancialAdminRole();
        const payTeacherInvoiceInMemoryRepository = new PayTeacherInvoiceInMemoryRepository();
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(payTeacherInvoiceInMemoryRepository);
        payTeacherInvoiceInMemoryRepository.seed(financialAdmin);

        // Quand je déclare que la facture 1, d'un montant de 200e, du professeur Thierry Quatre a été payée, si le professeur n'est pas trouvé
        const payInvoiceCommand = {
            teacherId: 999,
            amount: 200
        };

        // Alors une erreur "Professeur non trouvé" doit être renvoyée
        await expect(payTeacherInvoiceUsecase.execute(financialAdmin.id, payInvoiceCommand))
            .rejects.toThrow("Professeur non trouvé");

    })

    test('#US-5-AC-5: Diminution de -200e échouée, montant inférieur à 0', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const teacher = generateUserWithTeacherAmountToInvoice(500);
        const financialAdmin = generateUserWithFinancialAdminRole();
        const payTeacherInvoiceInMemoryRepository = new PayTeacherInvoiceInMemoryRepository();
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(payTeacherInvoiceInMemoryRepository);
        payTeacherInvoiceInMemoryRepository.seed(teacher);
        payTeacherInvoiceInMemoryRepository.seed(financialAdmin);

        // Quand je déclare que la facture 1, d'un montant de -200e, du professeur Thierry Quatre a été payée
        const payInvoiceCommand = {
            teacherId: 1,
            amount: -200 // Montant négatif
        };

        // Alors une erreur "le montant de la facture doit être supérieur à 0" doit être renvoyée
        await expect(payTeacherInvoiceUsecase.execute(financialAdmin.id, payInvoiceCommand))
            .rejects.toThrow("le montant de la facture doit être supérieur à 0");

    })

    test('#US-5-AC-6: Diminution de -200e échouée, solde à facturer inférieur à 200e', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const teacher = generateUserWithTeacherAmountToInvoice(100); // Solde de 100e, inférieur à 200e
        const financialAdmin = generateUserWithFinancialAdminRole();
        const payTeacherInvoiceInMemoryRepository = new PayTeacherInvoiceInMemoryRepository();
        const payTeacherInvoiceUsecase = new PayTeacherInvoiceUsecase(payTeacherInvoiceInMemoryRepository);
        payTeacherInvoiceInMemoryRepository.seed(teacher);
        payTeacherInvoiceInMemoryRepository.seed(financialAdmin);

        // Quand je déclare que la facture 1, d'un montant de 200e, du professeur Thierry Quatre a été payée, si le solde à payer du professeur est inférieur à 200e
        const payInvoiceCommand = {
            teacherId: 1,
            amount: 200 // Montant supérieur au solde disponible (100e)
        };

        // Alors une erreur "le solde à facturer doit être supérieur au montant de la facture" doit être renvoyée
        await expect(payTeacherInvoiceUsecase.execute(financialAdmin.id, payInvoiceCommand))
            .rejects.toThrow("le solde à facturer doit être supérieur au montant de la facture");

    })

})
