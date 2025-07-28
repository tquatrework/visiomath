import {describe, expect, test} from "vitest";
import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { UserBuilder } from "../../../../common/test/fixture/userBuilder";
import { DataSource } from "typeorm";
import {TeacherInvoiceStatus} from "../../createTeacherInvoice/teacherInvoice.entity";

describe('#US-7: Visualisation des factures enseignant', () => {

    test('#US-7-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const financialManagerBuilder = new UserBuilder(app)
            .withId(1)
            .withRole("financial_admin")
            .withFirstName("Finance")
            .withLastName("Manager");
        await financialManagerBuilder.build();
        const token = await financialManagerBuilder.getToken();

        // et que le professeur David Robert a une facture de 600e avec un id de 1
        const teacherBuilder = new UserBuilder(app)
            .withId(2)
            .withRole("teacher")
            .withTeacherProfileId(2)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status) VALUES ($1, $2, $3, $4, $5, $6)',
            [1, 600, 2, 'invoice-1.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION]
        );

        // Quand je veux visualiser toutes les factures, si tout se passe bien
        const res = await request(app.getHttpServer())
            .get('/get-teacher-invoices')
            .set('Authorization', `Bearer ${token}`);

        // Alors je dois voir la facture id 1 à 600e de David Robert
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            {
                id: 1,
                teacherName: 'David Robert',
                amount: 600,
                pdfFile: 'invoice-1.pdf',
                creationDate: '2024-01-15T00:00:00.000Z',
                status: 'en attente de validation'
            }
        ]);

    })

    test('#US-7-AC-4: Visualisation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1
        const teacherBuilder = new UserBuilder(app)
            .withId(2)
            .withRole("teacher")
            .withTeacherProfileId(2)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();
        const teacherToken = await teacherBuilder.getToken();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status) VALUES ($1, $2, $3, $4, $5, $6)',
            [1, 600, 2, 'invoice-1.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION]
        );

        // Quand je veux visualiser toutes les factures
        const res = await request(app.getHttpServer())
            .get('/get-teacher-invoices')
            .set('Authorization', `Bearer ${teacherToken}`);

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Vous ne pouvez pas effectuer cette opération');

    })

})