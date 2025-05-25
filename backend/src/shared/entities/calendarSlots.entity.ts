

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('calendar_slots')
export class CalendarSlot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'varchar', length: 50 })
  calendarType!: string;

  @Column({ type: 'varchar', length: 10 })
  dayOfWeek!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'text', nullable: true })
  description: string='';

  //@Column({ type: 'int', nullable: true })
  //repeatStartWeek: number=0 ; // Semaine de début de répétition

  //@Column({ type: 'int', nullable: true })
  //repeatEndWeek: number = 0; // Semaine de fin de répétition

  @Column({ type: 'int' })
  startWeek!: number; // La première semaine de la série

  @Column({ type: 'int' })
  startYear!: number; // L'année associée à la première semaine
  
  @Column({ type: 'int', default: 0 })
  weeksToCopy: number = 0; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
