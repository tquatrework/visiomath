import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationUser } from '../../shared/entities/notificationUser.entity';
import { Notification } from '../../shared/entities/notification.entity'; 
import { User } from '../../shared/entities/user.entity';
import { NotificationUserService } from './notificationUsers.service';
import { NotificationUserController } from './notificationUsers.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationUser, Notification, User]),
        forwardRef(() => AuthModule)],
    controllers: [NotificationUserController],
    providers: [NotificationUserService],
    exports: [NotificationUserService],
})
export class NotificationUserModule {}
