import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from '../../shared/gateways/messages.gateway';
import { Message } from '../../shared/entities/message.entity';
import { Notification } from '../../shared/entities/notification.entity';
import { NotificationUser } from '../../shared/entities/notificationUser.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../shared/entities/user.entity';

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
