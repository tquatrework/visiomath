import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module'
import { describe, test, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import {PostgreSqlContainer} from "@testcontainers/postgresql";

describe('Save the teacher payment infos', () => {

    let app: INestApplication;

    beforeEach(async () => {
        const postgresContainer = await new PostgreSqlContainer("postgres:14").start();
        const connectionUrl = new URL(postgresContainer.getConnectionUri());

        process.env.DB_HOST = connectionUrl.hostname;
        process.env.DB_PORT = connectionUrl.port;
        process.env.DB_USERNAME = connectionUrl.username;
        process.env.DB_PASSWORD = connectionUrl.password;
        process.env.DB_NAME = connectionUrl.pathname.substring(1);
        process.env.JWT_SECRET='test';
        process.env.JWT_EXPIRATION='1d';
        process.env.JWT_REFRESH_EXPIRES_IN='30d';

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('It Should save the payment infos of the teacher', async () => {
        const res = await request(app.getHttpServer()).get('/users/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
});
