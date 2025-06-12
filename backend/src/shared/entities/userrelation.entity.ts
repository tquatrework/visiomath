import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './user.entity.js';
import { RelationList, RelationState } from '../../common/utils/lists.utils.js';

@Entity('user_relations')
export class UserRelation {
  @PrimaryGeneratedColumn()
  id!: number;

  // @ManyToOne(() => User, (user) => user.initiatedRelations, { eager: true })
  @ManyToOne(() => User, (user : User) => user.initiatedRelations)
  userFrom!: Relation<User>;

  // @ManyToOne(() => User, (user) => user.receivedRelations, { eager: true })
  @ManyToOne(() => User, (user : User) => user.receivedRelations)
  userTo!: Relation<User>;

  @Column({ type: 'varchar', length: 50 })
  relationType!: RelationList;

  @Column({ type: 'varchar', length: 50 })
  relationState!: RelationState;

  //@Column()
  //relationRight!: string='';
}
