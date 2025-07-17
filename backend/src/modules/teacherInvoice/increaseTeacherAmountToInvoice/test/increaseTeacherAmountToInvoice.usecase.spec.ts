import {beforeEach, describe, expect, test, } from "vitest";
import {User} from "../../../../shared/entities/user.entity";
import {UserProfile} from "../../../../shared/entities/userprofile.entity";
import {TeacherProfile} from "../../../../shared/entities/teacherProfile.entity";
import {IncreaseTeacherAmountToInvoiceUsecase} from "../increaseTeacherAmountToInvoice.usecase";
import {IncreaseTeacherAmountToInvoiceSuccessInMemoryRepository} from "./increaseTeacherAmountToInvoice.successInMemoryRepository";
import {IncreaseTeacherAmountToInvoiceFailureInMemoryRepository} from "./increaseTeacherAmountToInvoice.failureInMemoryRepository";

function generateUserWithTeacherAmountToInvoice(amountToInvoice: number): User {
    const teacher = new User();
    teacher.id = 1;

    const userProfile = new UserProfile();
    userProfile.id = 1;
    teacher.userProfile = userProfile;

    const teacherProfile = new TeacherProfile();
    teacherProfile.id = 1;
    teacherProfile.amountToInvoice = amountToInvoice;
    userProfile.teacherProfile = teacherProfile;
    return teacher;
}

describe('#US-3: Augmentation du solde à facturer du professeur', () => {


    test('#US-3-AC-1: Augmentation réussie de 20e', async () => {

        // Etant donné que je suis connecté en tant que professeur avec un solde à facturer de 30 euros
        const teacher = generateUserWithTeacherAmountToInvoice(30);

        const increaseTeacherAmountToInvoiceSuccessInMemoryRepository = new IncreaseTeacherAmountToInvoiceSuccessInMemoryRepository();
        increaseTeacherAmountToInvoiceSuccessInMemoryRepository.seed(teacher);

        // Quand un coupon est enregistré avec un montant de 20e
        const increaseAmountCommand = {
            amount: 20
        };

        const increaseTeacherAmountToInvoiceUsecase = new IncreaseTeacherAmountToInvoiceUsecase(increaseTeacherAmountToInvoiceSuccessInMemoryRepository);
        await increaseTeacherAmountToInvoiceUsecase.execute(1, increaseAmountCommand);
        
        // Alors je dois voir mon solde à facturer augmenter à 50e
        const updatedTeacher = await increaseTeacherAmountToInvoiceSuccessInMemoryRepository.findUserByIdWithTeacherProfil(1);
        expect(updatedTeacher?.userProfile.teacherProfile?.amountToInvoice).toBe(50);

    })

    test('#US-3-AC-2: Augmentation échouée, professeur non trouvé', async () => {
        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 30e
        const teacher = generateUserWithTeacherAmountToInvoice(30);

        const increaseTeacherAmountToInvoiceSuccessInMemoryRepository = new IncreaseTeacherAmountToInvoiceSuccessInMemoryRepository();
        increaseTeacherAmountToInvoiceSuccessInMemoryRepository.seed(teacher);

        // Quand j'enregistre un coupon enregistré avec un montant de 20e, si je ne suis plus reconnu par le système comme professeur
        const increaseAmountCommand = {
            amount: 20
        };

        const increaseTeacherAmountToInvoiceUsecase = new IncreaseTeacherAmountToInvoiceUsecase(increaseTeacherAmountToInvoiceSuccessInMemoryRepository);

        // Alors une erreur "Professeur non trouvé" doit être affichée
        await expect(
            increaseTeacherAmountToInvoiceUsecase.execute(999, increaseAmountCommand) // ID professeur inexistant
        ).rejects.toThrow("Professeur introuvable.");
    })

    test('#US-3-AC-3: Augmentation échouée, montant de -20e (inférieur à 0)', async () => {
        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 30e
        const teacher = generateUserWithTeacherAmountToInvoice(30);

        const increaseTeacherAmountToInvoiceSuccessInMemoryRepository = new IncreaseTeacherAmountToInvoiceSuccessInMemoryRepository();
        increaseTeacherAmountToInvoiceSuccessInMemoryRepository.seed(teacher);

        // Quand j'enregistre un coupon enregistré avec un montant de -20
        const increaseAmountCommand = {
            amount: -20
        };

        const increaseTeacherAmountToInvoiceUsecase = new IncreaseTeacherAmountToInvoiceUsecase(increaseTeacherAmountToInvoiceSuccessInMemoryRepository);

        // Alors une erreur "Le montant doit être supérieur à 0"
        await expect(
            increaseTeacherAmountToInvoiceUsecase.execute(1, increaseAmountCommand)
        ).rejects.toThrow("Le montant doit supérieur à 0.");
    })

    test('#US-3-AC-4: Augmentation échouée, erreur lors de la sauvegarde du montant', async () => {
        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 30e
        const teacher = generateUserWithTeacherAmountToInvoice(30);

        const increaseTeacherAmountToInvoiceFailureInMemoryRepository = new IncreaseTeacherAmountToInvoiceFailureInMemoryRepository();
        increaseTeacherAmountToInvoiceFailureInMemoryRepository.seed(teacher);

        // Quand j'enregistre un coupon enregistré avec un montant de 20e, si l'enregistrement échoue pour des raisons inconnues
        const increaseAmountCommand = {
            amount: 20
        };

        const increaseTeacherAmountToInvoiceUsecase = new IncreaseTeacherAmountToInvoiceUsecase(increaseTeacherAmountToInvoiceFailureInMemoryRepository);

        // Alors une erreur "Erreur lors de l'augmentation du montant à facturer du professeur." doit être affichée
        await expect(
            increaseTeacherAmountToInvoiceUsecase.execute(1, increaseAmountCommand)
        ).rejects.toThrow("Erreur lors de l'augmentation du montant à facturer du professeur.");
    })

})
