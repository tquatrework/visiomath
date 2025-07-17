import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {beforeEach, describe, expect, test} from "vitest";
import {DataSource} from "typeorm";
import {UserBuilder} from "../../../../common/test/fixture/userBuilder";

declare global {
    var app: INestApplication;
}

describe('#US-4: Affichage du solde à facturer du professeur', () => {

    test('#US-4-AC-1: Affichage du solde de 50e réussie', async () => {

        // Etant donné que je suis connecté en tant que professeur avec un montant à facturer de 50e
        const userBuilder = new UserBuilder(app).withId(1).withRole("teacher").withTeacherAmountToInvoice(50)
        await userBuilder.build();
        const userToken = await userBuilder.getToken();

        // Quand je consulte mon solde à facturer
        const res = await request(app.getHttpServer())
            .get('/teacher-amount-to-invoice')
            .set('Authorization', `Bearer ${userToken}`);

        // Alors je dois voir mon solde à facturer à 50e
        expect(res.status).toBe(200);
        expect(res.body.amountToInvoice).toBe(50);

    })


})
