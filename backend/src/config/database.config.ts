import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join} from 'path';
import { getDirname } from '../common/utils/path-utils.js';



export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  autoLoadEntities: true,
  synchronize: true,
  logging: false,
  //logging:  ['query', 'error', 'schema', 'migration'],
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
    } : false,
  extra: {
    connectionLimit: 10,
    //log: (msg: string) => console.log(`[Database Pool Log] ${msg}`),
  },
  retryAttempts: 0
}));