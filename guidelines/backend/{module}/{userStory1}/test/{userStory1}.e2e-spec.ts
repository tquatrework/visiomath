import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {beforeEach, describe, expect, test} from "vitest";
import {DataSource} from "typeorm";
import {UserBuilder} from "../../../../common/test/fixture/userBuilder";

declare global {
    var app: INestApplication;
}

describe('#{userStory1Id}: {userStory1Name}', () => {

    test('#{scenario1Id}: {scenario1Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        // Et que j'ai des données enregistrées
        const userBuilder = new UserBuilder(app).withId(1).withRole("user");
        await userBuilder.build();
        const userToken = await userBuilder.getToken();
        
        // Seed des données de test
        await app.get(DataSource).query(
            'INSERT INTO {table_name} (userId, name, firstName) VALUES ($1, $2, $3)',
            [1, 'Dupont', 'JeanPierre']
        );

        // Quand je demande mes données
        const res = await request(app.getHttpServer())
            .get('/{userStory1-route}')
            .set('Authorization', `Bearer ${userToken}`);

        // Alors je dois recevoir mes données
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Dupont');
        expect(res.body.firstName).toBe('JeanPierre');
    });

    test('#{scenario2Id}: {scenario2Name}', async () => {
        // Etant donné que je suis connecté en tant qu'utilisateur
        // Et que je n'ai pas de données enregistrées
        const userBuilder = new UserBuilder(app).withId(2).withRole("user");
        await userBuilder.build();
        const userToken = await userBuilder.getToken();

        // Quand je demande mes données
        const res = await request(app.getHttpServer())
            .get('/{userStory1-route}')
            .set('Authorization', `Bearer ${userToken}`);

        // Alors je dois recevoir une erreur
        expect(res.status).toBe(404);
        expect(res.body.message).toContain('Données introuvables');
    });
});
