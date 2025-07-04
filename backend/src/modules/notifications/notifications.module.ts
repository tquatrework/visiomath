import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../shared/entities/notification.entity'; // Entité Notification
import { User } from '../../shared/entities/user.entity'; // Entité User (assurez-vous qu'elle existe)
import { NotificationUser } from '../../shared/entities/notificationUser.entity'; // Entité NotificationUser (assurez-vous qu'elle existe)
import { NotificationUserModule } from '../notificationUsers/notificationUsers.module';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, NotificationUser]),
  forwardRef(() => AuthModule),
  NotificationUserModule], // Import des entités Notification et User (qui implique AuthModule)
  controllers: [NotificationsController], // Déclaration du contrôleur
  providers: [NotificationsService], // Déclaration du service
  exports: [NotificationsService], // Export du service
})
export class NotificationsModule {}
