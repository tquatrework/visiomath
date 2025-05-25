import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action : string ='';

  @Column('json')
  details: any;

  @CreateDateColumn()
  createdAt!: Date;
}