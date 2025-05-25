import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationUser } from '../../shared/entities/notificationUser.entity.js';
import { Notification } from '../../shared/entities/notification.entity.js';
import { User } from '../../shared/entities/user.entity.js';

@Injectable()
export class NotificationUserService {
  constructor(
    @InjectRepository(NotificationUser)
    private readonly notificationUserRepository: Repository<NotificationUser>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Retrieve all notification-user entries with optional filters.
   */
  async findAll(filters?: { notificationId?: number; userId?: number; unread?: boolean }): Promise<NotificationUser[]> {
    const query = this.notificationUserRepository.createQueryBuilder('notificationUser')
      .leftJoinAndSelect('notificationUser.notification', 'notification')
      .leftJoinAndSelect('notificationUser.user', 'user');
      //.orderBy('notificationUser.createdAt', 'DESC');

    if (filters?.notificationId) {
      query.andWhere('notification.id = :notificationId', { notificationId: filters.notificationId });
    }

    if (filters?.userId) {
      query.andWhere('user.id = :userId', { userId: filters.userId });
    }

    if (filters?.unread) {
      query.andWhere('notificationUser.read = :read', { read: false });
    }

    return query.getMany();
  }

  /**
   * Associate a user with a notification.
   */
  async createNotificationUser(data: { userId: number; notificationId: number }): Promise<NotificationUser> {
    const { userId, notificationId } = data;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    const notificationUser = this.notificationUserRepository.create({
      user,
      notification,
      read: false,
      actionDone: false,
    });

    return this.notificationUserRepository.save(notificationUser);
  }

  /**
   * Update a notification-user entry.
   */
  async updateNotificationUser(id: number, updateDto: { read?: boolean; actionDone?: boolean }): Promise<NotificationUser> {
    const notificationUser = await this.notificationUserRepository.findOne({ where: { id } });
    if (!notificationUser) {
      throw new NotFoundException(`NotificationUser with ID ${id} not found`);
    }

    Object.assign(notificationUser, updateDto);
    return this.notificationUserRepository.save(notificationUser);
  }

  /**
   * Mark a notification-user as read or action as done for a specific user.
   */
  async markNotificationUser(
    notificationId: number,
    userId: number,
    updateDto: { read?: boolean; actionDone?: boolean }
  ): Promise<NotificationUser> {
    const notificationUser = await this.notificationUserRepository.findOne({
      where: { notification: { id: notificationId }, user: { id: userId } },
    });

    if (!notificationUser) {
      throw new NotFoundException(`NotificationUser not found for Notification ID ${notificationId} and User ID ${userId}`);
    }

    Object.assign(notificationUser, updateDto);
    return this.notificationUserRepository.save(notificationUser);
  }

  /**
   * Delete a notification-user entry.
   */
  async deleteNotificationUser(id: number): Promise<void> {
    const result = await this.notificationUserRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`NotificationUser with ID ${id} not found`);
    }
  }
}
