//src/modules/exercise/exercises.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../shared/entities/message.entity.js';
import { User } from '../../shared/entities/user.entity.js';
import { CreateMessageDto } from '../../shared/dto/create-message.dto.js';
import { GetMessagesDto } from '../../shared/dto/get-messages.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Retrieve all messages with optional filters.
   */
  async getMessages(filterDto: GetMessagesDto): Promise<Message[]> {
    const { filter, userId, date } = filterDto;
    const query = this.messageRepository.createQueryBuilder('message');

    if (filter === 'date' && date) {
      query.where('DATE(message.timestamp) = :date', { date });
    } else if (filter === 'userrelation' && userId) {
      query.where('(message.senderId = :userId OR message.receiverId = :userId)', { userId });
    }

    return query.orderBy('message.timestamp', 'DESC').getMany();
  }

  /**
   * Retrieve a specific message by ID.
   */
  async getMessageById(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  /**
   * Send a new message and create a notification for the recipient.
   */
  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { senderId, receiverId, content } = createMessageDto;

    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });
    if (!receiver) {
      throw new NotFoundException(`User with ID ${receiverId} not found`);
    }

    const message = this.messageRepository.create({ senderId, receiverId, content });
    await this.messageRepository.save(message);

    await this.notificationsService.createNotification({
      userIds: [receiverId],
      message: `Nouveau message reçu de l'utilisateur ${senderId}`,
      type: 'message',
      url: `/chat`,
      //url: `/messages/${message.id}`,
    });

    return message;
  }
}
