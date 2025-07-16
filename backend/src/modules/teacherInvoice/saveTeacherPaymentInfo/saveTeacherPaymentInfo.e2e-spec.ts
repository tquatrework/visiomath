import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {DataSource} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {User} from "../../../shared/entities/user.entity";
import {UserProfile} from "../../../shared/entities/userprofile.entity";
import {TeacherProfile} from "../../../shared/entities/teacherProfile.entity";
import {UserBuilder} from "../../../common/test/fixture/userBuilder";


declare global {
    var app: INestApplication;
}

describe('#US-1: Enregistrement des informations personnelles / de paiement du professeur', () => {

    test('#US-1-AC-1: Enregistrement réussi avec BIC 6 + 2', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const userBuilder = new UserBuilder(app).withRole("teacher");
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();

        /**Quand j'enregistre :
            nom de l'entreprise : "ProfCompany"
            siret : "12345678912345
            type entreprise : Autoentrepreneur
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
                companyType: 'Autoentrepreneur',
                vatExempt: false,
                iban: 'FR1234567891234567891234567',
                bic: 'azertyaz'
            });



        //Alors mon enregistrement doit être confirmé
        expect(res.status).toBe(201);

        const teacherProfile = await app
            .get(DataSource)
            .query('SELECT * FROM teacher_profiles WHERE "userProfileId" = $1 LIMIT 1', [1]);


        expect(teacherProfile[0]?.companyName).toBe('ProfCompany');


    });

    test('#US-1-AC-2: Enregistrement échoué avec SIRET de moins de 14 caractères', async () => {

        //Etant donné que je suis connecté en tant que professeur
        const userBuilder = new UserBuilder(app).withRole("teacher");
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();

        /**Quand j’enregistre :
         nom de l’entreprise : “ProfCompany”
         Siret : “12345678912"
         type entreprise : Autoentrepreneur
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
                companyType: "Autoentrepreneur",
                vatExempt: true,
                iban: "FR1234567891234567891234567",
                bic: "azerty33"
        });

        //Alors mon enregistrement doit renvoyer une erreur “Le SIRET doit contenir 14 caractères”
        expect(res.status).toBe(422);
        expect(res.body.message).toContain('Le SIRET doit contenir 14 caractères');
    });

    /**
     * #US-1-AC-7 : Enregistrement échoué – Données manquantes
     * Étant donné que je suis connecté en tant que professeur
     * Quand j’enregistre mes infos avec BIC oublié :
     *    • BIC vide
     *    • les autres informations sont valides
     * Alors la requête doit échouer avec l’erreur :
     *  « Des données sont manquantes »
     */

    test('#US-1-AC-7: Enregistrement échoué – Données manquantes', async () => {
        // Etant donné que je suis connecté en tant que professeur
        const userBuilder = new UserBuilder(app).withRole("teacher");
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();
        /** Quand j’enregistre mes infos avec BIC oublié :
         *    • BIC vide
         *    • les autres informations sont valides
         */

        const res = await request(app.getHttpServer())
            .post('/teacher-payment-info')
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                companyName: "ProfCompany",
                siret: "12345678912345",
                companyType: "Autoentrepreneur",
                vatExempt: true,
                iban: "FR1234567891234567891234567",
            });


        // Alors la requête doit échouer avec l’erreur :
        //  « Des données sont manquantes »
        expect(res.status).toBe(422);
        expect(res.body.message).toContain('Des données sont manquantes');

    });
});
