import {describe, expect, test} from "vitest";
import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { UserBuilder } from "../../../../common/test/fixture/userBuilder";
import { DataSource } from "typeorm";
import {TeacherInvoiceStatus} from "../../createTeacherInvoice/teacherInvoice.entity";

describe('US-12: Visualisation historique de factures pour le professeur', () => {

    test('US-12-AC-1: Visualisation réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur "David Robert" et que j'ai une facture id 1,  validée, créée le 12/12/23 avec un montant de 300e
        const teacherBuilder = new UserBuilder(app)
            .withId(1)
            .withRole("teacher")
            .withTeacherProfileId(1)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();
        const teacherToken = await teacherBuilder.getToken();

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status) VALUES ($1, $2, $3, $4, $5, $6)',
            [1, 300, 1, 'invoice_1.pdf', new Date('2023-12-12'), TeacherInvoiceStatus.VALIDEE]
        );

        // Quand je veux visualiser toutes mes factures,
        const res = await request(app.getHttpServer())
            .get('/current-teacher-invoices')
            .set('Authorization', `Bearer ${teacherToken}`);

        // Alors je dois voir la facture id 1, validée, à 300e, créée le 12/12/2023
        expect(res.status).toBe(200);
        expect(res.body.invoices).toHaveLength(1);
        expect(res.body.invoices[0]).toEqual({
            id: 1,
            status: "validé",
            amount: 300,
            creationDate: "12/12/2023",
            pdfFile: "invoice_1.pdf"
        });

    })

    test('US-12-AC-4: Visualisation échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que Responsable financier,
        const financialAdminBuilder = new UserBuilder(app)
            .withId(2)
            .withRole("financial_admin")
            .withFirstName("Finance")
            .withLastName("Manager");
        await financialAdminBuilder.build();
        const financialAdminToken = await financialAdminBuilder.getToken();

        // Quand je veux visualiser toutes les factures,
        const res = await request(app.getHttpServer())
            .get('/current-teacher-invoices')
            .set('Authorization', `Bearer ${financialAdminToken}`);

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Vous ne pouvez pas effectuer cette opération');

    })

})