import { beforeEach, afterEach } from 'vitest'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import {PostgreSqlContainer, StartedPostgreSqlContainer} from "@testcontainers/postgresql";
import {AppModule} from "./src/app.module";


declare global {
    var app: INestApplication | undefined
    var pgContainer: StartedPostgreSqlContainer | undefined
}

beforeEach(async () => {
    globalThis.pgContainer = await new PostgreSqlContainer("postgres:14").start();
    const url = new URL(globalThis.pgContainer.getConnectionUri())

    process.env.DB_HOST = url.hostname
    process.env.DB_PORT = url.port
    process.env.DB_USERNAME = url.username
    process.env.DB_PASSWORD = url.password
    process.env.DB_NAME = url.pathname.slice(1)
    process.env.JWT_SECRET = 'test'
    process.env.JWT_EXPIRATION = '1d'
    process.env.JWT_REFRESH_EXPIRES_IN = '30d'

    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile()

    globalThis.app = moduleRef.createNestApplication()
    await globalThis.app.init()
})

afterEach(async () => {
    await globalThis.app?.close()
    await globalThis.pgContainer?.stop()
    globalThis.app = undefined
    globalThis.pgContainer = undefined
})
