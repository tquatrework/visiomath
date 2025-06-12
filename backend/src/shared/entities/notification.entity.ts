import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { NotificationUser } from './notificationUser.entity.js';
import { NotificationType } from '../../common/utils/lists.utils.js';
//import { ActionNotification } from './actionNotification.entity.js';  // Supposons que vous avez une entité ActionNotification

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => NotificationUser, (notificationUser) => notificationUser.notification)
  notificationUsers!: Relation<NotificationUser[]>; // Liste des associations utilisateurs-notifications

  @Column()
  message: string = ''; // Message de la notification

  @Column({ type: 'varchar', length: 50 })
  type: NotificationType = 'message';  // Type de notification (par exemple, 'relation_request', 'message', etc.)

  @Column({ nullable: true })
  actionLabel?: string; // Texte de l'action associée à la notification

  @Column({ nullable: true })
  url: string = ''; // URL de redirection de la notification

  @Column({ type: 'jsonb', nullable: true })
  params?: Record<string, any>; // Paramètres supplémentaires pour la notification

  @Column({ nullable: true })
  actionMode?: string = ''; // URL de redirection de la notification

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date; // Date de création de la notification
}
