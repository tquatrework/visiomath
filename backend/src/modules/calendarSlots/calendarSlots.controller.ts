import { 
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, HttpException, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CalendarSlotsService } from './calendarSlots.service.js';
import { CalendarSlot } from '../../shared/entities/calendarSlots.entity.js';

@ApiTags('Calendar Slots')
@UseGuards(JwtAuthGuard)
@Controller('calendar-slots')
export class CalendarSlotsController {
  constructor(private readonly calendarSlotsService: CalendarSlotsService) {}

  /**
   * Retrieve all calendar slots for a specific user and optionally filter by type.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all calendar slots for a user' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
  @ApiQuery({ name: 'calendarType', required: false, description: 'Type of calendar (Availability, Courses, Global)' })
  @ApiResponse({ status: 200, description: 'List of calendar slots retrieved successfully.', type: [CalendarSlot] })
  async findAll(@Query('userId') userId: string, @Query('calendarType') calendarType?: string): Promise<CalendarSlot[]> {
    return this.calendarSlotsService.findAll(parseInt(userId), calendarType);
  }

  /**
   * Retrieve a specific calendar slot by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific calendar slot by ID' })
  @ApiParam({ name: 'id', description: 'Calendar Slot ID' })
  @ApiResponse({ status: 200, description: 'Calendar slot retrieved successfully.', type: CalendarSlot })
  @ApiResponse({ status: 404, description: 'Calendar slot not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CalendarSlot> {
    return this.calendarSlotsService.findOne(id);
  }

  /**
   * Create a new calendar slot.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new calendar slot' })
  @ApiResponse({ status: 201, description: 'Calendar slot created successfully.', type: CalendarSlot })
  async create(@Body() slotData: Partial<CalendarSlot>): Promise<CalendarSlot> {
    return this.calendarSlotsService.create(slotData);
  }

  /**
   * Bulk save multiple calendar slots for a user.
   */
  @Post('/save-bulk')
  @ApiOperation({ summary: 'Bulk save multiple calendar slots' })
  @ApiResponse({ status: 201, description: 'Calendar slots saved successfully.' })
  async saveSlotsBulk(@Body() slots: Partial<CalendarSlot[]>): Promise<void> {
    return this.calendarSlotsService.saveCalendarSlots(slots);
  }

  /**
   * Update an existing calendar slot by ID.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a calendar slot by ID' })
  @ApiParam({ name: 'id', description: 'Calendar Slot ID' })
  @ApiResponse({ status: 200, description: 'Calendar slot updated successfully.', type: CalendarSlot })
  @ApiResponse({ status: 404, description: 'Calendar slot not found.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() slotData: Partial<CalendarSlot>): Promise<CalendarSlot> {
    return this.calendarSlotsService.update(id, slotData);
  }

  /**
   * Delete a specific calendar slot by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calendar slot by ID' })
  @ApiParam({ name: 'id', description: 'Calendar Slot ID' })
  @ApiResponse({ status: 200, description: 'Calendar slot deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Calendar slot not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.calendarSlotsService.delete(id);
  }

  /**
   * Delete all calendar slots for a specific user and calendar type.
   */
  @Delete('all/:userId')
  @ApiOperation({ summary: 'Delete all calendar slots for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'calendarType', description: 'Type of calendar', required: true })
  @ApiResponse({ status: 200, description: 'All calendar slots for the user deleted successfully.' })
  @ApiResponse({ status: 404, description: 'No calendar slots found for the user.' })
  async deleteAllSlots(@Param('userId', ParseIntPipe) userId: number, @Query('calendarType') calendarType: string): Promise<{ message: string }> {
    const deletedCount = await this.calendarSlotsService.deleteAllSlots(userId, calendarType);
    if (deletedCount === 0) {
      throw new HttpException('No calendar slots found for the given user ID and type', HttpStatus.NOT_FOUND);
    }
    return { message: `${deletedCount} calendar slots deleted for user ID ${userId} and calendar type ${calendarType}` };
  }
}
