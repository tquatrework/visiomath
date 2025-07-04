import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification } from '../../shared/entities/notification.entity';
import { CreateNotificationDto } from '../../shared/dto/create-notification.dto';
import { User } from '../../shared/entities/user.entity';
import { NotificationUser } from '../../shared/entities/notificationUser.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(NotificationUser)
    private readonly notificationUserRepository: Repository<NotificationUser>,
  ) {}

  /**
   * Create a new notification.
   */
  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    const { userIds, message, type, actionLabel, url, params, actionMode } = data;

    // Verify that all users exist
    const users = await this.userRepository.find({ where: { id: In(userIds) } });
    if (users.length !== userIds.length) {
      throw new NotFoundException(`One or more users with ID ${userIds} not found`);
    }

    // Create and save the main notification
    const notification = this.notificationRepository.create({
      message,
      type,
      actionLabel: actionLabel || undefined,
      url: url || undefined,
      params: params || undefined,
      actionMode: actionMode || undefined,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    // Create NotificationUser entries
    const notificationUsers = userIds.map(userId =>
      this.notificationUserRepository.create({
        user: { id: userId },
        notification: { id: savedNotification.id },
        read: false,
        actionDone: false,
      }),
    );

    await this.notificationUserRepository.save(notificationUsers);
    return savedNotification;
  }

  /**
   * Retrieve all notifications with optional filters (userId, unread).
   */
  async findAll(filters?: { userId?: number; unread?: boolean }): Promise<Notification[]> {
    const query = this.notificationRepository.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.notificationUsers', 'notificationUsers')
      .orderBy('notification.createdAt', 'DESC');

    if (filters?.userId) {
      query.andWhere('notificationUsers.user.id = :userId', { userId: filters.userId });
      if (filters.unread) {
        query.andWhere('notificationUsers.read = :read', { read: false });
      }
    }

    return query.getMany();
  }

  /**
   * Update a notification or a notification-user entry.
   */
  async updateNotification(notificationId: number, updateData: Partial<Notification> & { read?: boolean }, userId?: number):
    Promise<Notification | null> {
    if (userId) {
      // Update NotificationUser if userId is provided
      const notificationUser = await this.notificationUserRepository.findOne({
        where: { notification: { id: notificationId }, user: { id: userId } },
      });

      if (!notificationUser) {
        throw new NotFoundException(`Notification ${notificationId} not found for user ${userId}`);
      }

      Object.assign(notificationUser, updateData);
      await this.notificationUserRepository.save(notificationUser);
      return null; // Return null if only NotificationUser is updated
    } else {
      // Update Notification if no userId is provided
      const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
      if (!notification) {
        throw new NotFoundException(`Notification with ID ${notificationId} not found`);
      }

      Object.assign(notification, updateData);
      return this.notificationRepository.save(notification);
    }
  }

  /**
   * Delete a specific notification.
   */
  async deleteNotification(notificationId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    await this.notificationRepository.delete(notificationId);
  }
}
