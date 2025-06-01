// shared/entities/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToOne, OneToMany, ManyToMany, JoinColumn, Relation
} from 'typeorm';
import { UserFile } from './userfile.entity.js';
import { UserProfile } from './userprofile.entity.js';
import { UserRelation } from './userrelation.entity.js';
import { NotificationUser } from './notificationUser.entity.js';
import { RoleList } from '../../common/utils/lists.utils';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password:  string = '';

  @Column({ default: true })
  isActive: boolean = true;

  @Column({ default: false })
  hasConnectedOnce: boolean = false;

  @Column()
  role!: RoleList;
  
  @Column()
  pseudo!: string; // Pseudo de l'utilisateur

  @Column({ nullable: true })
  firstName:  string = '';

  @Column({ nullable: true })
  lastName:  string = '';

  @Column({ type: 'date', nullable: true, default: '1900-01-01' })
  dateOfBirth?: Date; // Nouvelle colonne pour la date de naissance

  @Column({ nullable: true })
  address?: string; // Adresse de résidence

  @Column({ nullable: true })
  zipCode?: number; // Code postal de résidence

  @Column({ nullable: true })
  city?: string; // Ville de résidence

  // A MODIFIER, RENDRE OBLIGATOIRE LE NUMERO DE TELEPHONE A LA CREATION DU COMPTE
  @Column({ nullable: true })
  phoneNumber?: string; // Téléphone

  @OneToMany(() => UserRelation, (relation:UserRelation) => relation.userFrom)
  initiatedRelations?: UserRelation[];

  @OneToMany(() => UserRelation, (relation:UserRelation) => relation.userTo)
  receivedRelations?: UserRelation[];

  @OneToOne(() => UserProfile, (userProfile: UserProfile) => userProfile.user, {onDelete: 'CASCADE'}) // Relation inverse vers UserProfile
  @JoinColumn()
  userProfile : Relation<UserProfile> = null as any;
  //userProfile : UserProfile = null as any;

  @OneToMany(() => UserFile, (userFile: UserFile) => userFile.user) // Relation inverse vers UserFile
  userFiles!: Relation<UserFile>[]; // Un utilisateur peut avoir plusieurs fichiers

 @OneToMany(() => NotificationUser, (notificationUser) => notificationUser.user)
  notificationUsers!: Relation<NotificationUser[]>; // Liste des associations utilisateurs-notifications

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Exclure le mot de passe lors de la sérialisation
  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }

}