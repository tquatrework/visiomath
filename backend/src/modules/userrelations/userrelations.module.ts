// src/user-relations/user-relations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelation } from '../../shared/entities/userrelation.entity.js';
import { UserRelationsService } from './userrelations.service.js';
import { UserRelationsController } from './userrelations.controller.js';
import { User } from '../../shared/entities/user.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

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
