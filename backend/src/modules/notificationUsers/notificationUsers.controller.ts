import { 
  Controller, Post, Get, Patch, Delete, Query, Param, Body, ParseIntPipe, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationUser } from '../../shared/entities/notificationUser.entity';
import { NotificationUserService } from './notificationUsers.service';
import { Notification } from '../../shared/entities/notification.entity';

@ApiTags('Notification Users')
@UseGuards(JwtAuthGuard)
@Controller('notification-users')
export class NotificationUserController {
  constructor(private readonly notificationUserService: NotificationUserService) {}

  /**
   * Retrieve all notification-user entries with optional filters.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve notification-user entries with optional filters' })
  @ApiQuery({ name: 'notificationId', description: 'Filter by notification ID', required: false })
  @ApiQuery({ name: 'userId', description: 'Filter by user ID', required: false })
  @ApiQuery({ name: 'unread', description: 'Filter unread notifications', required: false, type: Boolean })
  async findAll(
    @Query('notificationId') notificationId?: string,
    @Query('userId') userId?: string,
    @Query('unread') unread?: boolean
  ): Promise<NotificationUser[]> {
    return this.notificationUserService.findAll({ 
      notificationId: notificationId ? parseInt(notificationId) : undefined, 
      userId: userId ? parseInt(userId) : undefined, 
      unread 
    });
  }

  /**
   * Associate a user with a notification.
   */
  @Post()
  @ApiOperation({ summary: 'Associate a user with a notification' })
  @ApiResponse({ status: 201, description: 'NotificationUser entry created successfully.' })
  async createNotificationUser(@Body() data: { userId: number; notificationId: number }) {
    return this.notificationUserService.createNotificationUser(data);
  }

  /**
   * Update a notification-user entry.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification-user entry' })
  @ApiParam({ name: 'id', description: 'NotificationUser ID' })
  @ApiBody({
    description: 'Fields to update (read, actionDone)',
    schema: {
      type: 'object',
      properties: {
        read: { type: 'boolean', nullable: true },
        actionDone: { type: 'boolean', nullable: true },
      },
    },
  })
  async updateNotificationUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: { read?: boolean; actionDone?: boolean },
  ) {
    return this.notificationUserService.updateNotificationUser(id, updateDto);
  }

  /**
   * Mark a notification as read or action as done for a specific user.
   */
  @Patch()
  @ApiOperation({ summary: 'Mark a notification as read or action as done for a specific user' })
  @ApiQuery({ name: 'notificationId', description: 'Notification ID', required: true })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'read', description: 'Mark as read', required: false, type: Boolean })
  @ApiQuery({ name: 'actionDone', description: 'Mark action as done', required: false, type: Boolean })
  async markNotificationUser(
    @Query('notificationId') notificationId: string,
    @Query('userId') userId: string,
    @Query('read') read?: boolean,
    @Query('actionDone') actionDone?: boolean,
  ) {
    return this.notificationUserService.markNotificationUser(parseInt(notificationId), parseInt(userId), { read, actionDone });
  }

  /**
   * Delete a notification-user entry.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification-user entry' })
  @ApiParam({ name: 'id', description: 'NotificationUser ID' })
  async deleteNotificationUser(@Param('id', ParseIntPipe) id: number) {
    return this.notificationUserService.deleteNotificationUser(id);
  }
}
