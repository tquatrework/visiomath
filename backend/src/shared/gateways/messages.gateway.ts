import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../../modules/messages/messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { NotificationsService } from '../../modules/notifications/notifications.service';

@WebSocketGateway({ cors: true }) // Active WebSockets avec prise en charge du CORS
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private activeUsers = new Map<number, string>(); // Map userId -> socketId

  constructor(@Inject(forwardRef(() => MessagesService)) private readonly messagesService: MessagesService,
  //constructor(private readonly messagesService: MessagesService,
    private readonly notificationsService: NotificationsService, 
  ) {}

  // 📌 Lorsqu'un utilisateur se connecte au WebSocket
  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId); // Récupération de l'ID utilisateur
    if (userId) {
      this.activeUsers.set(userId, client.id);
      console.log(`Utilisateur connecté : ${userId}`);
    }
  }

  // 📌 Lorsqu'un utilisateur se déconnecte
  handleDisconnect(client: Socket) {
    const userId = [...this.activeUsers.entries()].find(([, id]) => id === client.id)?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`Utilisateur déconnecté : ${userId}`);
    }
  }

  // 📌 Lorsqu'un message est envoyé
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.createMessage(createMessageDto);

    const receiverSocketId = this.activeUsers.get(createMessageDto.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', message);
    }

    return message;
  }

  // 📌 Lorsqu'une notification est lue
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@MessageBody() data: { notificationId: number, userId: number }) {
    /* await this.notificationsService.markNotificationAsRead(data.notificationId, data.userId); // ✅ Correction */
    await this.notificationsService.updateNotification(data.notificationId, { read: true }, data.userId);


    // Notification côté client que la lecture a été confirmée
    this.server.emit('messageRead', data);
  }
}
