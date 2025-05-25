import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarSlot } from '../../shared/entities/calendarSlots.entity.js';
import { CalendarSlotsService } from './calendarSlots.service.js';
import { CalendarSlotsController } from './calendarSlots.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarSlot]), AuthModule],
  controllers: [CalendarSlotsController],
  providers: [CalendarSlotsService],
  exports: [CalendarSlotsService],
})
export class CalendarSlotsModule {}
