import {beforeEach, describe, expect, test, } from "vitest";
import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {UserBuilder} from "../../../../common/test/fixture/userBuilder";
import {DataSource} from "typeorm";

declare global {
    var app: INestApplication;
}

describe('#US-3: Augmentation du solde à facturer du professeur', () => {

    test('#US-3-AC-1: Augmentation réussie de 30e', async () => {

        // Etant donné que je suis connecté en tant que professeur avec un solde à facturer de 30 euros
        const userBuilder = new UserBuilder(app).withRole("teacher").withId(1).withTeacherAmountToInvoice(30);
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();

        // Quand un coupon est enregistré avec un montant de 30e
        const res = await request(app.getHttpServer())
            .get('/teacher-fake-add-coupon/1')
            .set('Authorization', `Bearer ${teacherToken}`);

        // Alors je dois voir mon solde à facturer augmenter à 60e
        expect(res.status).toBe(200);
        
        // Attendre que l'événement asynchrone soit traité
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const teacherProfile = await app
            .get(DataSource)
            .query('SELECT * FROM teacher_profiles WHERE "userProfileId" = $1 LIMIT 1', [1]);
        
        expect(Number(teacherProfile[0]?.amountToInvoice)).toBe(60);

    })

})
