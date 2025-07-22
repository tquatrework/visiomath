import {beforeEach, describe, expect, test} from "vitest";
import { CreateTeacherInvoiceUsecase } from "../createTeacherInvoice.usecase";
import { CreateTeacherInvoiceCommand } from "../createTeacherInvoice.command";
import { CreateTeacherInvoiceDateTimeProvider } from "../createTeacherInvoice.dateTimeProvider";
import { DeterministicDateTimeProvider } from "./createTeacherInvoice.deterministicDateTimeProvider";
import { User } from "../../../../shared/entities/user.entity";
import { UserProfile } from "../../../../shared/entities/userprofile.entity";
import { TeacherProfile } from "../../../../shared/entities/teacherProfile.entity";
import { TeacherInvoice } from "../teacherInvoice.entity";
import { CreateTeacherInvoiceFailureInMemoryFileStorage } from "./createTeacherInvoice.failureInMemoryFileStorage";
import { CreateTeacherInvoiceFileStorage } from "../createTeacherInvoice.fileStorage";
import { CreateTeacherInvoiceSuccessInMemoryRepository } from "./createTeacherInvoice.successInMemoryRepository";
import { CreateTeacherInvoiceFailureInMemoryRepository } from "./createTeacherInvoice.failureInMemoryRepository";
import {CreateTeacherInvoiceSuccessInMemoryFileStorage} from "./createTeacherInvoice.successInMemoryFileStorage";

function generateTeacherUser(): User {
    const teacher = new User();
    teacher.id = 123;
    teacher.pseudo = "Thierry Teacher";
    teacher.role = "teacher";
    
    const userProfile = new UserProfile();
    userProfile.id = 1;
    teacher.userProfile = userProfile;
    
    const teacherProfile = new TeacherProfile();
    teacherProfile.id = 1;
    userProfile.teacherProfile = teacherProfile;
    
    return teacher;
}

function generateFinancialManagerUser(): User {
    const financialManager = new User();
    financialManager.id = 456;
    financialManager.pseudo = "Financial Manager";
    financialManager.role = "financial_admin";
    
    const userProfile = new UserProfile();
    userProfile.id = 2;
    financialManager.userProfile = userProfile;
    
    return financialManager;
}

describe('US-6: Envoie d\'une facture', () => {

    let deterministicDateTimeProvider: CreateTeacherInvoiceDateTimeProvider;
    let currentDate: Date;
    let teacher: User;
    let financialManager: User;

    beforeEach(() => {
        currentDate = new Date('2025-07-21T14:30:45.000Z');
        deterministicDateTimeProvider = new DeterministicDateTimeProvider(currentDate);
    })

    test('US-6-AC-1-1: Envoie réussie : facture créée', async () => {

        // Etant donné que je suis connecté en tant que professeur 
        const teacher = generateTeacherUser();
        const currentDate = new Date('2025-07-21T14:30:45.000Z');
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');

        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(teacher);
        
        const successFileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            successFileStorage
        );
        
        // Quand j'envoie un montant de 600e et un fichier PDF
        const command = new CreateTeacherInvoiceCommand(
            teacher,
            600,
            fileContent,
        );
        
        // Exécuter la commande
        await createTeacherInvoiceUsecase.execute(command);
        
        // Alors une facture contenant : montant, fichier pdf, date de création, professeur (moi) et status 'en attente de validation' doit être créée
        expect(createTeacherInvoiceInMemoryRepository.createdInvoice).toEqual({
            id: expect.any(Number),
            teacher: teacher,
            amount: 600,
            pdfFile: expect.stringContaining(".pdf"),
            creationDate: currentDate,
            status: "en attente de validation"
        });
    })

    test('US-6-AC-1-2: Envoie réussie : fichier PDF enregistré', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const teacher = generateTeacherUser();
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');
        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(teacher);
        
        const inMemoryFileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            inMemoryFileStorage
        );
        
        // Quand j'envoie un montant de 600e et un fichier PDF
        const command = new CreateTeacherInvoiceCommand(
            teacher.id,
            600,
            fileContent
        );
        await createTeacherInvoiceUsecase.execute(command);
        
        // Alors le fichier PDF doit être renommé avec le format "invoice-nom-professeur-date-du-jour.pdf" (en minuscule, sans espace et caractères spéciaux)
        expect(inMemoryFileStorage.savedFiles.length).toBe(1);
        expect(inMemoryFileStorage.savedFiles[0].originalName).toContain('.pdf');
        expect(inMemoryFileStorage.savedFiles[0].content).toEqual(fileContent);
        expect(inMemoryFileStorage.savedFiles[0].savedPath).toContain('invoice-thierryteacher-2025-07-21-14-30-45.pdf');
        expect(inMemoryFileStorage.savedFiles[0].savedPath).toContain('/uploads/');
        expect(inMemoryFileStorage.savedFiles[0].savedPath).toContain('.pdf');
        
        // Vérifier que le chemin du fichier a été enregistré dans la facture
        expect(createTeacherInvoiceInMemoryRepository.createdInvoice?.pdfFile).toBe(inMemoryFileStorage.savedFiles[0].savedPath);
    })
    
    test('US-6-AC-2: Envoie échoué, utilisateur non teacher', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const financialManager = generateFinancialManagerUser();
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');

        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(financialManager);
        
        const successFileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            successFileStorage
        );
        
        // Quand j'envoie un montant de 600e et un fichier PDF
        const command = new CreateTeacherInvoiceCommand(
            financialManager.id,
            600,
            fileContent,
        );
        
        // Alors une erreur "Vous ne pouvez pas créer de facture" doit être envoyée
        await expect(createTeacherInvoiceUsecase.execute(command)).rejects.toThrow("Vous ne pouvez pas créer de facture");
    })
    
    test('US-6-AC-3: Envoie échoué, utilisateur non trouvé', async () => {

        // Etant donné que je suis connecté en tant que teacher mais non enregistré par le système
        const nonExistentTeacherId = 999; // ID d'un enseignant qui n'existe pas
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');

        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        // Aucun utilisateur n'est seedé dans le repository
        
        const successFileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            successFileStorage
        );
        
        // Quand j'envoie un montant de 600e et un fichier PDF
        const command = new CreateTeacherInvoiceCommand(
            nonExistentTeacherId,
            600,
            fileContent,
        );
        
        // Alors une erreur "Professeur non trouvé" doit être envoyée
        await expect(createTeacherInvoiceUsecase.execute(command)).rejects.toThrow("Professeur non trouvé");
    })
    
    test('US-6-AC-4: Envoie échoué, montant inférieur à 0', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const teacher = generateTeacherUser();
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');

        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(teacher);
        
        const successFileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            successFileStorage
        );
        
        // Quand j'envoie un montant de -200e et un fichier PDF
        const command = new CreateTeacherInvoiceCommand(
            teacher.id,
            -200,
            fileContent,
        );
        
        // Alors une erreur "le montant de la facture doit être supérieur à 0" doit être envoyée
        await expect(createTeacherInvoiceUsecase.execute(command)).rejects.toThrow("le montant de la facture doit être supérieur à 0");
    })

    test('US-6-AC-5: Envoie échoué, deuxième facture pour le mois en cours', async () => {

        // Etant donné que je suis connecté en tant que professeur et que j'ai déjà envoyée une facture pour le mois en cours
        const teacher = generateTeacherUser();
        const currentDate = new Date('2025-07-21T14:30:45.000Z');
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');
        
        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(teacher);
        
        // Créer une facture pour le mois en cours
        const existingInvoice = new TeacherInvoice(
            teacher,
            500,
            "/uploads/previous_invoice.pdf",
            currentDate
        );
        existingInvoice.id = 1;
        createTeacherInvoiceInMemoryRepository.seedInvoice(existingInvoice);
        
        const successFileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            successFileStorage
        );
        
        // Quand j'envoie un montant de 600e et un fichier PDF
        const command = new CreateTeacherInvoiceCommand(
            teacher,
            600,
            fileContent,
        );
        
        // Alors une erreur "vous avez déjà envoyée une facture pour le mois en cours" doit être envoyée
        await expect(createTeacherInvoiceUsecase.execute(command)).rejects.toThrow("vous avez déjà envoyée une facture pour le mois en cours");
    })

    test('US-6-AC-8: Envoie échoué, enregistrement fichier échoué', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const teacher = generateTeacherUser();

        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(teacher);
        
        // Utiliser un fileStorage qui échoue
        const failureFileStorage = new CreateTeacherInvoiceFailureInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            failureFileStorage
        );
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');

        // Quand j'envoie un montant et un fichier PDF, si l'enregistrement ne fonctionne pas pour une raison inconnue
        const command = new CreateTeacherInvoiceCommand(
            teacher.id,
            600,
            fileContent,
        );
        
        // Alors une erreur "La facture n'a pas pu être créée" doit être envoyée
        await expect(createTeacherInvoiceUsecase.execute(command)).rejects.toThrow("La facture n'a pas pu être créée");
    })

    test('US-6-AC-9: Envoie échoué : fichier pas en PDF', async () => {

        // Etant donné que je suis connecté en tant que professeur 
        const teacher = generateTeacherUser();
        // Créer un contenu qui n'est clairement pas un PDF (sans la signature %PDF-)
        const fileContent = Buffer.from('JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00\x43\x00This is a JPEG file not a PDF');
        
        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceSuccessInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(teacher);
        
        const fileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();
        
        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            fileStorage
        );
        
        // Quand j'envoie un montant de 600e et un fichier qui n'est pas un PDF
        const command = new CreateTeacherInvoiceCommand(
            teacher.id,
            600,
            fileContent, // Buffer sans l'en-tête PDF
        );
        
        // Alors une erreur "Le fichier doit être un PDF" doit être renvoyé
        await expect(createTeacherInvoiceUsecase.execute(command)).rejects.toThrow("Le fichier doit être un PDF");
    })


    test('US-6-AC-10: Envoie échoue, enregistrement facture échoué', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const teacher = generateTeacherUser();

        const createTeacherInvoiceInMemoryRepository = new CreateTeacherInvoiceFailureInMemoryRepository();
        createTeacherInvoiceInMemoryRepository.seed(teacher);

        // Utiliser un fileStorage qui réussit (le problème est dans le repository cette fois)
        const successFileStorage = new CreateTeacherInvoiceSuccessInMemoryFileStorage();

        const createTeacherInvoiceUsecase = new CreateTeacherInvoiceUsecase(
            createTeacherInvoiceInMemoryRepository,
            deterministicDateTimeProvider,
            successFileStorage
        );
        const fileContent = Buffer.from('%PDF-1.5\nfake pdf content');

        // Quand j'envoie un montant et un fichier PDF, si l'enregistrement de la facture échoue
        const command = new CreateTeacherInvoiceCommand(
            teacher.id,
            600,
            fileContent,
        );

        // Alors une erreur "La facture n'a pas pu être créée" doit être envoyée
        await expect(createTeacherInvoiceUsecase.execute(command)).rejects.toThrow("La facture n'a pas pu être créée");
    })

})
