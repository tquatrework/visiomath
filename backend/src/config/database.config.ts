// database.config.ts
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join} from 'path';
import { getDirname } from '../common/utils/path-utils.js';

const __dirname = getDirname(import.meta.url);


export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT, 10) || 5432,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '..', 'shared', 'entities', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  autoLoadEntities: true,
  //  synchronize: process.env.NODE_ENV !== 'production', // À désactiver en production
  synchronize: true,  
//  logging: true,
  logging:  ['query', 'error', 'schema', 'migration'],
//  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
    } : false,
  extra: {
    connectionLimit: 10, // Limite de connexions pour le pool
    log: (msg: string) => console.log(`[Database Pool Log] ${msg}`), // Log personnalisé
  },

}));