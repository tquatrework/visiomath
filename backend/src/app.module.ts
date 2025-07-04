import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { getDirname } from './common/utils/path-utils';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UserSpacesModule } from './modules/userspaces/userspaces.module';
import { UserProfilesModule } from './modules/userprofiles/userprofiles.module';
import { UserRelationsModule } from './modules/userrelations/userrelations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UserFilesModule } from './modules/userfiles/userfiles.module';
import { StudentProfileModule } from './modules/studentProfile/studentProfile.module';
import { StudentOrdonnanceModule } from './modules/studentOrdonnance/studentOrdonnance.module';
import { TeacherProfileModule } from './modules/teacherProfile/teacherProfile.module';
import { TeacherOrdonnanceModule } from './modules/teacherOrdonnance/teacherOrdonnance.module';
import { ExerciseModule } from './modules/exercices/exercises.module';
import { NotificationUserModule } from './modules/notificationUsers/notificationUsers.module';
import { CalendarSlotsModule } from './modules/calendarSlots/calendarSlots.module';
import { MessagesModule } from './modules/messages/messages.module';
import {TeacherInvoiceModule} from "./modules/teacherInvoice/teacherInvoice.module";



@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [databaseConfig, jwtConfig],
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
    TeacherInvoiceModule
  ],
})
export class AppModule {}