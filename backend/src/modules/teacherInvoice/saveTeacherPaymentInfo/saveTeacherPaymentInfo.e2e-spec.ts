import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module'
import { describe, test, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

describe('Save the teacher payment infos', () => {

    test('should be defined', () => {
        expect(true).toBeDefined();
    });


    let app: INestApplication;

    beforeAll(async () => {

        console.log('env', process.env.NODE_ENV);
        console.log('E2E DB username:', process.env.DB_USERNAME);
        console.log('E2E DB HOST:', process.env.DB_HOST);
        console.log('E2E DB name:', process.env.DB_NAME);
        console.log('E2E DB password:', process.env.DB_PASSWORD);
        console.log('E2E DB port:', process.env.DB_PORT);

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
