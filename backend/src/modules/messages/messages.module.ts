import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service.js';
import { MessagesController } from './messages.controller.js';
import { MessagesGateway } from '../../shared/gateways/messages.gateway.js';
import { Message } from '../../shared/entities/message.entity.js';
import { Notification } from '../../shared/entities/notification.entity.js';
import { NotificationUser } from '../../shared/entities/notificationUser.entity.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../../shared/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Notification, NotificationUser, User]),
    NotificationsModule,
    forwardRef(() => AuthModule),
  ], 
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesGateway, // Ajout du forwardRef pour casser la boucle
  ],
  exports: [MessagesService], // Ajout de MessagesGateway dans les exports pour éviter les erreurs
})
export class MessagesModule {}
