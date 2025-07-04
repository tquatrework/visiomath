import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarSlot } from '../../shared/entities/calendarSlots.entity';
import { CalendarSlotsService } from './calendarSlots.service';
import { CalendarSlotsController } from './calendarSlots.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarSlot]), AuthModule],
  controllers: [CalendarSlotsController],
  providers: [CalendarSlotsService],
  exports: [CalendarSlotsService],
})
export class CalendarSlotsModule {}
