import {describe, expect, test} from "vitest";
import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {UserBuilder} from "../../../../common/test/fixture/userBuilder";
import {DataSource} from "typeorm";
import {TeacherInvoiceStatus} from "../../createTeacherInvoice/teacherInvoice.entity";

describe('#US-14: Connaître le nombre de factures créées pour le mois en cours', () => {

    test('#US-14-AC-1: récupération réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec deux factures créées pour le mois en cours
        const teacherBuilder = new UserBuilder(app)
            .withId(1)
            .withRole("teacher")
            .withTeacherProfileId(1)
            .withFirstName("David")
            .withLastName("Robert");
        await teacherBuilder.build();
        const teacherToken = await teacherBuilder.getToken();

        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const secondDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);

        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status) VALUES ($1, $2, $3, $4, $5, $6)',
            [1, 100, 1, 'invoice-1.pdf', firstDayOfMonth, TeacherInvoiceStatus.EN_ATTENTE_DE_VALIDATION]
        );
        
        await app.get(DataSource).query(
            'INSERT INTO teacher_invoices (id, amount, "teacherId", "pdfFile", "creationDate", status) VALUES ($1, $2, $3, $4, $5, $6)',
            [2, 150, 1, 'invoice-2.pdf', secondDayOfMonth, TeacherInvoiceStatus.VALIDE]
        );

        // Quand j'affiche le nombre de factures pour le mois en cours
        const response = await request(app.getHttpServer())
            .get('/teacher-invoices/current-month/count')
            .set('Authorization', `Bearer ${teacherToken}`);

        console.log(response.body);
        // Alors je dois recevoir "2"
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(2);
        
    })

    test('#US-13-AC-4: Récupération échouée : utilisateur pas professeur', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const financialManagerBuilder = new UserBuilder(app)
            .withId(2)
            .withRole("financial_admin")
            .withFirstName("Finance")
            .withLastName("Manager");
        await financialManagerBuilder.build();
        const financialManagerToken = await financialManagerBuilder.getToken();

        // Quand j'affiche le nombre de factures pour le mois en cours
        const response = await request(app.getHttpServer())
            .get('/teacher-invoices/current-month/count')
            .set('Authorization', `Bearer ${financialManagerToken}`);

        // Alors je dois recevoir une erreur "Vous ne pouvez pas effectuer cette opération"
        expect(response.status).toBe(422);
        expect(response.body.message).toBe('Vous ne pouvez pas effectuer cette opération');

    })

})