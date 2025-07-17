// users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../shared/entities/user.entity';
import { UserProfile } from '../../shared/entities/userprofile.entity';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity';
import { Notification } from '../../shared/entities/notification.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, TeacherProfile, Notification]),
    forwardRef(() => AuthModule),
    forwardRef(() => NotificationsModule),
    ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}