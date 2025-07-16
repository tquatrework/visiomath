import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {beforeEach, describe, expect, test} from "vitest";
import {DataSource} from "typeorm";
import generateUserToken from "../../../common/test/fixture/generateUserToken";

declare global {
    var app: INestApplication;
}

describe('#{userStory2Id}: {userStory2Name}', () => {

    test('#{scenario1Id}: {scenario1Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        const userToken = await generateUserToken(app, "user");

        // Quand j'enregistre mes données
        const res = await request(app.getHttpServer())
            .post('/{userStory2-route}')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Dupont',
                firstName: 'JeanPierre'
            });

        // Alors mon enregistrement doit être confirmé
        expect(res.status).toBe(201);

        // Vérification en base de données
        const userData = await app
            .get(DataSource)
            .query('SELECT * FROM {table_name} WHERE "userId" = $1 LIMIT 1', [1]);

        expect(userData[0]?.name).toBe('Dupont');
        expect(userData[0]?.firstName).toBe('JeanPierre');
    });

    test('#{scenario2Id}: {scenario2Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        const userToken = await generateUserToken(app, "user");

        // Quand j'enregistre avec des données invalides
        const res = await request(app.getHttpServer())
            .post('/{userStory2-route}')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: "", // nom vide
                firstName: "JeanPierre"
            });

        // Alors mon enregistrement doit renvoyer une erreur
        expect(res.status).toBe(422);
        expect(res.body.message).toContain('Le nom est obligatoire');
    });
});
