import {describe, expect, test} from "vitest";
import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { UserBuilder } from "../../../../common/test/fixture/userBuilder";
import { DataSource } from "typeorm";
import {TeacherInvoiceStatus} from "../../createTeacherInvoice/teacherInvoice.entity";

declare global {
    var app: INestApplication;
}

describe('US-10: Refus de la facture', () => {

    test('US-10-AC-1: Refus réussie', async () => {

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

        // Quand je veux refuser la facture 1 avec en raison "mauvais format de la facture : png" si tout se passe bien
        const res = await request(app.getHttpServer())
            .put('/refuse-teacher-invoice/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ invoiceId: 1, refusalReason: "mauvais format de la facture : png" });

        // Alors la facture doit avoir le status "refusée" et une date de refus
        expect(res.status).toBe(200);
        
        const invoice = await app.get(DataSource).query(
            'SELECT * FROM teacher_invoices WHERE id = $1',
            [1]
        );
        
        expect(invoice[0].status).toBe('refusée');
        expect(invoice[0].refusedAt).toBeDefined();
        expect(invoice[0].refusalReason).toBe('mauvais format de la facture : png');

    })

    test('US-10-AC-5: refus échoué : utilisateur pas responsable financier', async () => {

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

        // Quand je veux refuser la facture 2 avec en raison "mauvais format de la facture : png"
        const res = await request(app.getHttpServer())
            .put('/refuse-teacher-invoice/2')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({ invoiceId: 2, refusalReason: "mauvais format de la facture : png" });

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Vous ne pouvez pas effectuer cette opération');

    })

})