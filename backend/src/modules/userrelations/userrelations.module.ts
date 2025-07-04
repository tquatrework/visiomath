// src/user-relations/user-relations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelation } from '../../shared/entities/userrelation.entity';
import { UserRelationsService } from './userrelations.service';
import { UserRelationsController } from './userrelations.controller';
import { User } from '../../shared/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([UserRelation, User]),
    AuthModule,
    UsersModule,
    NotificationsModule,
],
  providers: [UserRelationsService],
  controllers: [UserRelationsController],
})
export class UserRelationsModule {}
