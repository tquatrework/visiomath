import {describe, expect, test} from "vitest";
import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { UserBuilder } from "../../../../common/test/fixture/userBuilder";
import { DataSource } from "typeorm";
import {TeacherInvoiceStatus} from "../../createTeacherInvoice/teacherInvoice.entity";

describe('US-9: Validation de la facture', () => {

    test('US-9-AC-1: Validation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier et que le professeur David Robert a une facture de 600e avec un id de 1
        const financialManagerBuilder = new UserBuilder(app)
            .withId(1)
            .withRole("financial_admin")
            .withFirstName("Finance")
            .withLastName("Manager");
        await financialManagerBuilder.build();
        const token = await financialManagerBuilder.getToken();

        const teacherBuilder = new UserBuilder(app)
            .withId(2)
            .withRole("teacher")
            .withTeacherProfileId(2)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status) VALUES ($1, $2, $3, $4, $5, $6)',
            [1, 600, 2, 'facture-david-robert.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION]
        );

        // Quand je veux valider la facture 1, si tout se passe bien
        const res = await request(app.getHttpServer())
            .put('/validate-teacher-invoice/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ invoiceId: 1 });

        // Alors la facture doit avoir le status "validé" et une date de validation
        expect(res.status).toBe(200);
        
        const invoice = await app.get(DataSource).query(
            'SELECT * FROM teacher_invoices WHERE id = $1',
            [1]
        );
        
        expect(invoice[0].status).toBe('validé');
        expect(invoice[0].validatedAt).toBeDefined();

    })

    test('US-9-AC-6: Validation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1
        const teacherBuilder = new UserBuilder(app)
            .withId(3)
            .withRole("teacher")
            .withTeacherProfileId(3)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();
        const teacherToken = await teacherBuilder.getToken();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status) VALUES ($1, $2, $3, $4, $5, $6)',
            [2, 600, 3, 'facture-david-robert.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION]
        );

        // Quand je veux valider la facture 1
        const res = await request(app.getHttpServer())
            .put('/validate-teacher-invoice/2')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({ invoiceId: 2 });

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Vous ne pouvez pas effectuer cette opération');

    })

})