// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { CreateUserDto } from '../../shared/dto/create-user.dto';
import { UpdateUserDto } from '../../shared/dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Notification } from '../../shared/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    private readonly notificationService: NotificationsService,
  ) {}

  /**
   * Create a new user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    if (['student', 'parent'].includes(createUserDto.role ?? '')) {
      const managers = await this.userRepository.find({
        where: [
          { role: 'pedagogical_manager' },
          { role: 'financial_admin' },
          { role: 'it_admin' },
        ],
      });
      const managerIds = managers.map((manager) => manager.id);

      await this.notificationService.createNotification({
        userIds: managerIds,
        message: `Un nouvel utilisateur de type ${user.role} s'est inscrit: ${user.pseudo}`,
        type: 'client_creation',
        actionLabel: 'Prendre en charge',
        url: '',
        params: { userPseudo: `${user.pseudo}` },
        actionMode: 'mono',
      });
    }

    return this.userRepository.save(user);
  }

  /**
   * Retrieve user by ID.
   */
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Retrieve user by Pseudo.
   */
  async findByPseudo(pseudo: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { pseudo } });
    if (!user) {
      return undefined;  // Retourne undefined au lieu de lever une exception 
      // (nécessaire pour la vérification du pseido lors de la création d'un user)
    }
    return user;
  }

  /**
   * Retrieve user by Email.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Retrieve users by roles.
   */
  async findByRoles(roles: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: { role: In(roles) },
    });
  }

  /**
   * Update an existing user.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

    
  /**
   * Validate user credentials.
   */
/*   async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  } */
    
  /**
   * Delete a user by ID.
   */
  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
