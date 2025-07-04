// userfile.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity('user_files')
export class UserFile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string ;

  @Column()
  path: string='./datafiles/vma_files';

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: Relation<User>;

  @Column()
  category: string = '';

  @Column()
  subcategory: string = '';

  @Column()
  comment: string = ''; 

  //@CreateDateColumn({ name: 'created_at' })
  //createdAt!: Date;

}