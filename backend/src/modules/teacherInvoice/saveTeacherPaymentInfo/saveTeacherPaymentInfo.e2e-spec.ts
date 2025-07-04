import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {beforeEach} from "vitest";
import {DataSource} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import generateUserToken from "../../../common/test/fixture/generateUserToken";


declare global {
    var app: INestApplication;
}

describe('#US-1: Enregistrement des informations personnelles / de paiement du professeur', () => {

    test('#US-1-AC-1: Enregistrement réussi avec BIC 6 + 2', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const teacherToken = await generateUserToken(app, "teacher");

        /**Quand j’enregistre :
            nom de l’entreprise : “ProfCompany”
            siret : “12345678912345
            type entreprise : AE
            assujetti TVA : non
            IBAN : FR 1234567891234567891234567
            Bic : azertyaz
         */
        const res = await request(app.getHttpServer())
            .post('/teacher-payment-info')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                companyName: 'ProfCompany',
                siret: '12345678912345',
                companyType: 'AE',
                vatExempted: false,
                iban: 'FR1234567891234567891234567',
                bic: 'azertyaz'
            });

        //Alors mon enregistrement doit être confirmé
        expect(res.status).toBe(201);

        const teacherProfile = await app
            .get(DataSource)
            .query('SELECT * FROM teacher_profiles WHERE "userProfileId" = $1', [1])

        console.log(teacherProfile);

        expect(teacherProfile?.paymentInfo?.companyName).toBe('ProfCompany');


    });

    test('#US-1-AC-2: Enregistrement échoué avec SIRET de moins de 14 caractères', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const teacherToken = await generateUserToken(app, "teacher");

        /**Quand j’enregistre :
         nom de l’entreprise : “ProfCompany”
         Siret : “12345678912"
         type entreprise : AE
         assujetti TVA : non
         IBAN : FR FR1234567891234567891234567
         Bic : azerty33
         */
        const res = await request(app.getHttpServer())
            .post('/teacher-payment-info')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                companyName: "ProfCompany",
                siret: "12345678912",
                companyType: "AE",
                vatExempt: true,
                iban: "FR1234567891234567891234567",
                bic: "azerty33"
        });


        //Alors mon enregistrement doit renvoyer une erreur “Le SIRET doit contenir 14 caractères”
        expect(res.status).toBe(422);
        expect(res.body.message).toContain('Le SIRET doit contenir 14 caractères');
    });
});
