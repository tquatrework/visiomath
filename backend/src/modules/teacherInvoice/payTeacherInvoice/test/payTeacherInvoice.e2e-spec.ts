import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {beforeEach, describe, expect, test} from "vitest";
import {DataSource} from "typeorm";
import {UserBuilder} from "../../../../common/test/fixture/userBuilder";

declare global {
    var app: INestApplication;
}

describe('#US-5: Paiement d\'une facture d\'un professeur', () => {

    test('#US-5-AC-1: Diminution réussie de 200e réussie', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const financialAdminBuilder = new UserBuilder(app).withId(1).withRole("financial_admin");
        await financialAdminBuilder.build();
        const financialAdminToken = await financialAdminBuilder.getToken();
        
        // Et que le professeur Thierry Quatre a un solde à facturer de 500e
        const teacherBuilder = new UserBuilder(app).withId(2).withRole("teacher").withTeacherAmountToInvoice(500);
        await teacherBuilder.build();

        // Quand je déclare que la facture 1, d'un montant de 200e, du professeur Thierry Quatre a été payée
        const teacherId = 2;
        const amountInvoiceToPay = 200;
        const response = await request(app.getHttpServer())
            .get(`/pay-teacher-invoice/${teacherId}/${amountInvoiceToPay}`)
            .set('Authorization', `Bearer ${financialAdminToken}`);


        // Alors le professeur Thierry Quatre doit voir son solde à facturer diminuer de 200e

        expect(response.status).toBe(200);

        const teacherProfile = await app
            .get(DataSource)
            .query('SELECT * FROM teacher_profiles WHERE "userProfileId" = $1 LIMIT 1', [2]);


        expect(parseFloat(teacherProfile[0]?.amountToInvoice)).toBe(300);

    })

})
