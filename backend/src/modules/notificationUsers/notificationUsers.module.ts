import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationUser } from '../../shared/entities/notificationUser.entity.js';
import { Notification } from '../../shared/entities/notification.entity.js'; 
import { User } from '../../shared/entities/user.entity.js';
import { NotificationUserService } from './notificationUsers.service.js';
import { NotificationUserController } from './notificationUsers.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationUser, Notification, User]),
        forwardRef(() => AuthModule)],
    controllers: [NotificationUserController],
    providers: [NotificationUserService],
    exports: [NotificationUserService],
})
export class NotificationUserModule {}
