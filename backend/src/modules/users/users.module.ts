// users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../shared/entities/user.entity';
import { Notification } from '../../shared/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import {UserTypeOrmRepository} from "./user.typeOrmRepository";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Notification]),
    forwardRef(() => AuthModule),
    forwardRef(() => NotificationsModule),
    ],
  controllers: [UsersController],
  providers: [UsersService, UserTypeOrmRepository],
  exports: [UsersService, UserTypeOrmRepository],
})
export class UsersModule {}