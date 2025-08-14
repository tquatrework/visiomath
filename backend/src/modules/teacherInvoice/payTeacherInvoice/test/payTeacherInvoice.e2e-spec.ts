import {describe, expect, test} from "vitest";
import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { UserBuilder } from "../../../../common/test/fixture/userBuilder";
import { DataSource } from "typeorm";
import {TeacherInvoiceStatus} from "../../createTeacherInvoice/teacherInvoice.entity";


describe('US-11: Paiement de la facture', () => {

    test('US-11-AC-1: Paiement réussi', async () => {

        // Étant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600 € avec un id de 1 et un solde à facturer de 700e
        const financialManagerBuilder = new UserBuilder(app)
            .withId(1)
            .withRole("financial_admin")
            .withFirstName("Finance")
            .withLastName("Manager");
        await financialManagerBuilder.build();
        const token = await financialManagerBuilder.getToken();

        const teacherBuilder = new UserBuilder(app)
            .withId(2)
            .withTeacherProfileId(2)
            .withFirstName("David")
            .withLastName("Robert")
            .withTeacherAmountToInvoice(700);
        await teacherBuilder.build();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status, "validatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [1, 600, 2, 'facture-david-robert.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.VALIDEE, new Date('2024-01-16')]
        );

        // Quand je veux payer la facture 1
        const res = await request(app.getHttpServer())
            .put('/pay-teacher-invoice/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ teacherInvoiceId: 1 });

        // Alors la facture doit avoir le statut "payée" et une date de paiement doit être enregistrée, et le solde du professeur doit être diminué du montant correspondant
        expect(res.status).toBe(200);
        
        const invoice = await app.get(DataSource).query(
            'SELECT * FROM teacher_invoices WHERE id = $1',
            [1]
        );
        
        expect(invoice[0].status).toBe('payée');
        expect(invoice[0].paidAt).toBeDefined();

        const teacherProfile = await app.get(DataSource).query(
            'SELECT * FROM teacher_profiles WHERE "userProfileId" = $1',
            [2]
        );

        expect(parseFloat(teacherProfile[0].amountToInvoice)).toBe(100);

    })

    test('US-11-AC-5: paiement échoué — utilisateur pas responsable financier', async () => {

        // Étant donné que je suis connecté en tant que professeur et que le professeur David Robert a une facture de 600 € avec un id de 1
        const teacherBuilder = new UserBuilder(app)
            .withId(3)
            .withTeacherProfileId(3)
            .withFirstName("David")
            .withLastName("Robert")
            .withTeacherAmountToInvoice(700);
        await teacherBuilder.build();
        const teacherToken = await teacherBuilder.getToken();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status, "validatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [2, 600, 3, 'facture-david-robert-2.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.VALIDEE, new Date('2024-01-16')]
        );

        // Quand je veux payer la facture 1
        const res = await request(app.getHttpServer())
            .put('/pay-teacher-invoice/2')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({ teacherInvoiceId: 2 });

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération" et le solde du professeur doit toujours être de 700e
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Vous ne pouvez pas effectuer cette opération');

        const teacherProfile = await app.get(DataSource).query(
            'SELECT * FROM teacher_profiles WHERE "userProfileId" = $1',
            [3]
        );

        expect(parseFloat(teacherProfile[0].amountToInvoice)).toBe(700);

    })

})