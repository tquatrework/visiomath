import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  senderId!: number;

  @Column()
  receiverId!: number;

  @Column()
  content: string="";

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ default: false })
  readStatus: boolean = false;
}
