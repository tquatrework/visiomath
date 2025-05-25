import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './config/jwt.config.js';
import redisConfig from './config/redis.config.js';
import databaseConfig from './config/database.config.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { getDirname } from './common/utils/path-utils.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { UserSpacesModule } from './modules/userspaces/userspaces.module.js';
import { UserProfilesModule } from './modules/userprofiles/userprofiles.module.js';
import { UserRelationsModule } from './modules/userrelations/userrelations.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { UserFilesModule } from './modules/userfiles/userfiles.module.js';
import { StudentProfileModule } from './modules/studentProfile/studentProfile.module.js';
import { StudentOrdonnanceModule } from './modules/studentOrdonnance/studentOrdonnance.module.js';
import { TeacherProfileModule } from './modules/teacherProfile/teacherProfile.module.js';
import { TeacherOrdonnanceModule } from './modules/teacherOrdonnance/teacherOrdonnance.module.js';
import { ExerciseModule } from './modules/exercices/exercises.module.js';
import { NotificationUserModule } from './modules/notificationUsers/notificationUsers.module.js';
import { CalendarSlotsModule } from './modules/calendarSlots/calendarSlots.module.js';
import { MessagesModule } from './modules/messages/messages.module.js';


const __dirname = getDirname(import.meta.url);

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, jwtConfig, redisConfig],
    }),
    
    // Base de données
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      // S'assurer qu'on ne ferme pas la connexion automatiquement dans un environnement non voulu.
      synchronize: process.env.NODE_ENV !== 'production',
      migrationsRun: true,  // Ce paramètre va forcer TypeORM à exécuter les migrations dès l'initialisation.
      }),
    }),

    // Cache Redis
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', '172.20.0.6'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: 60 * 60, // Temps de vie en cache (1 heure par défaut)
      }),
    }),

    // Modules de l'application
    //RouterModule.register(routes),
    AuthModule,
    UsersModule,
    UserSpacesModule,
    UserProfilesModule,
    UserRelationsModule,
    NotificationsModule,
    NotificationUserModule,
    UserFilesModule,
    StudentProfileModule,
    StudentOrdonnanceModule,
    TeacherProfileModule,
    TeacherOrdonnanceModule,
    CalendarSlotsModule,
    MessagesModule,
    ExerciseModule,
  ],
})
export class AppModule {}