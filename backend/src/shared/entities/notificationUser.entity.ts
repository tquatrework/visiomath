import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from './user.entity';

@Entity('notification_users')
export class NotificationUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Notification, (notification) => notification.notificationUsers, {
    onDelete: 'CASCADE',
  })
  notification!: Relation<Notification>;

  @ManyToOne(() => User, (user) => user.notificationUsers, {
    onDelete: 'CASCADE',
  })
  user!: Relation<User>;

  @Column({ default: false })
  read: boolean = false; // Indique si l'utilisateur a lu la notification

  @Column({ default: false })
  actionDone: boolean = false; // Indique si l'utilisateur a effectué l'action associée
}
