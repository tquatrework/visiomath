//src/modules/calendarSlots/calendarSlots.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarSlot } from '../../shared/entities/calendarSlots.entity';

@Injectable()
export class CalendarSlotsService {
  constructor(
    @InjectRepository(CalendarSlot)
    private readonly calendarSlotRepository: Repository<CalendarSlot>,
  ) {}

  /**
   * Retrieve all calendar slots for a given user, optionally filtered by calendar type.
   */
  async findAll(userId: number, calendarType?: string): Promise<CalendarSlot[]> {
    const query = this.calendarSlotRepository
      .createQueryBuilder('calendarSlot')
      .where('calendarSlot.userId = :userId', { userId });

    if (calendarType) {
      query.andWhere('calendarSlot.calendarType = :calendarType', { calendarType });
    }

    return query
      .orderBy('calendarSlot.dayOfWeek', 'ASC')
      .addOrderBy('calendarSlot.startTime', 'ASC')
      .getMany();
  }

  /**
   * Retrieve a specific calendar slot by its ID.
   */
  async findOne(id: number): Promise<CalendarSlot> {
    return this.calendarSlotRepository.findOneOrFail({ where: { id } });
  }

  /**
   * Create a new calendar slot.
   */
  async create(slotData: Partial<CalendarSlot>): Promise<CalendarSlot> {
    const newSlot = this.calendarSlotRepository.create(slotData);
    return this.calendarSlotRepository.save(newSlot);
  }

  /**
   * Save multiple calendar slots in bulk (removes previous slots for the same user and type).
   */
  async saveCalendarSlots(slots: Partial<CalendarSlot[]>): Promise<void> {
    if (!slots.length) return; // Prevents an error if the array is empty

    const userId = slots[0]?.userId;
    const calendarType = slots[0]?.calendarType;

    if (userId && calendarType) {
      await this.calendarSlotRepository.delete({ userId, calendarType });
    }

    const validSlots = slots.filter((slot): slot is CalendarSlot => slot !== undefined);
    if (validSlots.length > 0) {
      await this.calendarSlotRepository.save(validSlots);
    }
  }

  /**
   * Update an existing calendar slot.
   */
  async update(id: number, slotData: Partial<CalendarSlot>): Promise<CalendarSlot> {
    await this.calendarSlotRepository.update(id, slotData);
    return this.findOne(id);
  }

  /**
   * Delete a specific calendar slot by ID.
   */
  async delete(id: number): Promise<void> {
    await this.calendarSlotRepository.delete(id);
  }

  /**
   * Delete all calendar slots for a specific user and calendar type.
   */
  async deleteAllSlots(userId: number, calendarType: string): Promise<number> {
    const result = await this.calendarSlotRepository.delete({ userId, calendarType });
    return result.affected || 0; // Return the number of deleted records
  }
}
