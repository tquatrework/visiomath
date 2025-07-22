import {beforeEach, describe, expect, test} from "vitest";
import {ViewTeacherInvoiceUsecase} from "../viewTeacherInvoice.usecase";
import {ViewTeacherInvoiceInMemoryRepository} from "./viewTeacherInvoice.inMemoryRepository";
import {User} from "../../../../shared/entities/user.entity";

describe('US-7. Visualisation de la facture', () => {
    
    let viewTeacherInvoiceRepository: ViewTeacherInvoiceInMemoryRepository;
    let viewTeacherInvoiceUsecase: ViewTeacherInvoiceUsecase;
    let teacher: User;
    
    beforeEach(() => {
        viewTeacherInvoiceRepository = new ViewTeacherInvoiceInMemoryRepository();
        viewTeacherInvoiceUsecase = new ViewTeacherInvoiceUsecase(viewTeacherInvoiceRepository);
        
        // Create a teacher user
        teacher = new User();
        teacher.id = 1;
        teacher.email = "david.robert@visiomath.com";
        teacher.firstName = "David";
        teacher.lastName = "Robert";
        teacher.role = "teacher";
    })

    test('US-7-AC-1: Visualisation réussie', async () => {
        // Etant donné que je suis connecté en tant que professeur et que le professeur a une facture de 600e avec un id de 1
        viewTeacherInvoiceRepository.setupInvoices([
            {
                id: 1,
                amount: 600,
                teacherId: 1,
                teacherFirstName: "David",
                teacherLastName: "Robert",
                creationDate: new Date("2025-07-01"),
                status: "en attente de validation",
                pdfFile: "invoice-1.pdf"
            }
        ]);
        
        // Quand je veux visualiser toutes les factures du professeur David Robert, si tout se passe bien
        const result = await viewTeacherInvoiceUsecase.execute(teacher.id);
        
        // Alors je dois voir la facture id 1 à 600e de David Robert
        expect(result.invoices).toHaveLength(1);
        expect(result.invoices[0].id).toBe(1);
        expect(result.invoices[0].amount).toBe(600);
        expect(result.invoices[0].teacherFirstName).toBe("David");
        expect(result.invoices[0].teacherLastName).toBe("Robert");
    })

})
