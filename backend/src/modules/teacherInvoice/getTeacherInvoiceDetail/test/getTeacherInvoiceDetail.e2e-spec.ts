import {describe, expect, test} from "vitest";
import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { UserBuilder } from "../../../../common/test/fixture/userBuilder";
import { DataSource } from "typeorm";
import {TeacherInvoiceStatus} from "../../createTeacherInvoice/teacherInvoice.entity";

describe('US-8: Visualisation du détail d\'une facture', () => {

    test('US-8-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const financialManagerBuilder = new UserBuilder(app)
            .withId(1)
            .withRole("financial_admin")
            .withFirstName("Finance")
            .withLastName("Manager");
        await financialManagerBuilder.build();
        const token = await financialManagerBuilder.getToken();

        // et que le professeur David Robert a une facture de 600e avec un id de 1 et une date de validation de 2024-01-15
        const teacherBuilder = new UserBuilder(app)
            .withId(2)
            .withRole("teacher")
            .withTeacherProfileId(2)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status, "dueDate") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [1, 600, 2, 'facture-david-robert.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION, "2024-01-15"]
        );

        // Quand je veux visualiser la facture 1, si tout se passe bien
        const res = await request(app.getHttpServer())
            .get('/get-teacher-invoice/1')
            .set('Authorization', `Bearer ${token}`);

        // Alors je dois voir les détails de la facture id 1 : id, nom du professeur, montant, date de création, status et un lien pour télécharger le PDF
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            id: 1,
            teacherName: 'David Robert',
            amount: 600,
            pdfFile: 'facture-david-robert.pdf',
            creationDate: '2024-01-15T00:00:00.000Z',
            status: 'en attente de validation',
            dueDate: "2024-01-15"
        });

    })

    test('US-8-AC-4: Visualisation échouée : utilisateur pas responsable financier', async () => {

        // Etant donné que je suis connecté en tant que professeur et que le professeur David Robert et que le professeur a une facture de 600e avec un id de 1 et une date d'échéance de 2024-01-15
        const teacherBuilder = new UserBuilder(app)
            .withId(3)
            .withRole("teacher")
            .withTeacherProfileId(3)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();
        const teacherToken = await teacherBuilder.getToken();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status, "dueDate") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [1, 600, 3, 'facture-david-robert.pdf', new Date('2024-01-15'), TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION, "2024-01-15"]
        );

        // Quand je veux visualiser la facture 1
        const res = await request(app.getHttpServer())
            .get('/get-teacher-invoice/2')
            .set('Authorization', `Bearer ${teacherToken}`);

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Vous ne pouvez pas effectuer cette opération');

    })

})