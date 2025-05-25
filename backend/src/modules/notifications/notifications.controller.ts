import { 
  Controller, Get, Post, Patch, Delete, Query, Param, Body, ParseIntPipe, ValidationPipe, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Notification } from '../../shared/entities/notification.entity.js';
import { NotificationsService } from './notifications.service.js';
import { CreateNotificationDto } from '../../shared/dto/create-notification.dto.js';

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  /**
   * Retrieve all notifications, with optional filters.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all notifications with optional filters' })
  @ApiQuery({ name: 'userId', description: 'Filter by user ID', required: false })
  @ApiQuery({ name: 'unread', description: 'Filter unread notifications', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'List of notifications retrieved successfully.', type: [Notification] })
  async findAll(
    @Query('userId') userId?: string,
    @Query('unread') unread?: boolean,
  ): Promise<Notification[]> {
    return this.notificationService.findAll({
      userId: userId ? parseInt(userId) : undefined,
      unread
    });
  }

  /**
   * Create a new notification.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully.', type: Notification })
  @ApiResponse({ status: 404, description: 'User or ActionNotification not found.' })
  async createNotification(@Body(new ValidationPipe()) data: CreateNotificationDto): Promise<Notification> {
    return this.notificationService.createNotification(data);
  } 

  /**
   * Update a notification by ID.
   */
  @Patch(':notificationId')
  @ApiOperation({ summary: 'Update a notification by ID' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification updated successfully.', type: Notification })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async updateNotification(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Body() updateData: Partial<Notification>,
  ): Promise<Notification> {
    return this.notificationService.updateNotification(notificationId, updateData) as Promise<Notification>;
  }

  /**
   * Delete a notification by ID.
   */
  @Delete(':notificationId')
  @ApiOperation({ summary: 'Delete a notification by ID' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async deleteNotification(@Param('notificationId', ParseIntPipe) notificationId: number): Promise<void> {
    return this.notificationService.deleteNotification(notificationId);
  }
}
