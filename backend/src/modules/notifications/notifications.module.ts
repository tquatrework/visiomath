import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { Notification } from '../../shared/entities/notification.entity.js'; // Entité Notification
import { User } from '../../shared/entities/user.entity.js'; // Entité User (assurez-vous qu'elle existe)
import { NotificationUser } from '../../shared/entities/notificationUser.entity.js'; // Entité NotificationUser (assurez-vous qu'elle existe)
import { NotificationUserModule } from '../notificationUsers/notificationUsers.module.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, NotificationUser]),
  forwardRef(() => AuthModule),
  NotificationUserModule], // Import des entités Notification et User (qui implique AuthModule)
  controllers: [NotificationsController], // Déclaration du contrôleur
  providers: [NotificationsService], // Déclaration du service
  exports: [NotificationsService], // Export du service
})
export class NotificationsModule {}
