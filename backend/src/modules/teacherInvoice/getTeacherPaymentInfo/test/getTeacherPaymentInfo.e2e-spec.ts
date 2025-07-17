import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {beforeEach, describe, expect, test} from "vitest";
import {DataSource} from "typeorm";
import {UserBuilder} from "../../../../common/test/fixture/userBuilder";

declare global {
    var app: INestApplication;
}

describe('#US-2: Récupération des informations bancaires du professeur', () => {

    test('#US-2-AC-1: Récupération réussie', async () => {


        // Etant donné que je suis connecté en tant que professeur avec ces informations bancaires stockées
        const userBuilder = new UserBuilder(app).withRole("teacher").withPaymentInfo({
            companyName: 'ProfCompany',
            siret : '12345678912345',
            companyType: 'Autoentrepreneur',
            subjectToVat: true,
            iban: 'FR1234567891234567891234567',
            bic: 'azertyaz'
        });

        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();

        // Quand je récupère mes informations bancaire
        const res = await request(app.getHttpServer())
            .get('/teacher-payment-info')
            .set('Authorization', `Bearer ${teacherToken}`);

        // Alors je dois voir mes informations bancaires
        expect(res.status).toBe(200);
        expect(res.body.companyName).toBe('ProfCompany');
        expect(res.body.siret).toBe('12345678912345');
        expect(res.body.companyType).toBe('Autoentrepreneur');
        expect(res.body.subjectToVat).toBe(true);
        expect(res.body.iban).toBe('FR1234567891234567891234567');
        expect(res.body.bic).toBe('azertyaz');

    })

})
