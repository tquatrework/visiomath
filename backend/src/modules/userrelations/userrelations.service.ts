import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { UserRelation } from '../../shared/entities/userrelation.entity.js';
import { RelationList, RelationState, RoleList } from '../../common/utils/lists.utils.js';
import { User } from '../../shared/entities/user.entity.js';
import { CreateUserRelationDto } from '../../shared/dto/create-userrelation.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class UserRelationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRelation)
    private readonly userRelationRepository: Repository<UserRelation>,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,  
  ) {}

  /**
   * Retrieve user relations based on user ID, relation type, and state.
   */
  async getUserFromRelations(
    userId: number,
    relationType?: RelationList,
    relationState?: RelationState,
  ): Promise<UserRelation[]> {
    const whereClause: any = { userFrom: Equal(userId) };

    if (relationType && relationType !== 'all' && relationType !== '*') {
      whereClause.relationType = relationType;
    }

    if (relationState) {
      whereClause.relationState = relationState;
    }

    return this.userRelationRepository.find({
      where: whereClause,
      relations: ['userTo'],
    });
  }

  /**
   * Retrieve user relations for userTo based on user ID, relation type, and state.
   */
  async getUserToRelations(
    userId: number,
    relationType?: RelationList,
    relationState?: RelationState,
  ): Promise<UserRelation[]> {
    const whereClause: any = { userTo: Equal(userId) };

    if (relationType && relationType !== 'all' && relationType !== '*') {
      whereClause.relationType = relationType;
    }

    if (relationState) {
      whereClause.relationState = relationState;
    }

    return this.userRelationRepository.find({
      where: whereClause,
      relations: ['userFrom'],
    });
  }

  /**
   * Create a new user relation.
   */
  async createUserRelation(createUserRelationDto: CreateUserRelationDto): Promise<UserRelation> {
    const { userFrom, userTo, relationState } = createUserRelationDto;

    const userFromEntity = await this.userRepository.findOne({ where: { id: userFrom } });
    const userToEntity = await this.userRepository.findOne({ where: { id: userTo } });

    if (!userFromEntity || !userToEntity) {
      throw new NotFoundException('User not found');
    }

    const existingRelation = await this.userRelationRepository.findOne({
      where: { userFrom: userFromEntity, userTo: userToEntity },
    });

    if (existingRelation) {
      throw new BadRequestException('Relation already exists');
    }

    const relation = this.userRelationRepository.create({
      ...createUserRelationDto,
      userFrom: userFromEntity,
      userTo: userToEntity,
    });

    if (relationState === 'requestedBack') {
      await this.notificationsService.createNotification({
        userIds: [relation.userFrom.id],
        message: `${relation.userTo.pseudo} a demandé à se connecter avec vous.`,
        type: 'relation_request',
        url: '/contacts',
        params: {},
        actionMode: 'mono',
      });
    }

    return this.userRelationRepository.save(relation);
  }


  /**
   * create first relations for a new user based on their role when they connect for the first time.
   */
  async createInitialRelations(user: User): Promise<void> {
      console.log('\n🔵 [RELATION] Création de relations pour :', user.email);
  console.log('🎯 Rôle utilisateur :', user.role);
    const targetRoles = this.getTargetRolesFor(user.role);
    console.log('🎯 Rôles cibles :', targetRoles);
    if (targetRoles.length === 0) return;

    const targetUsers = await this.usersService.findByRoles(targetRoles);
    console.log('📋 Utilisateurs cibles trouvés :', targetUsers.map(u => u.email));

    const relations: Partial<UserRelation>[] = [];

    for (const targetUser of targetUsers) {
      const directType = await this.determineRelationType(user.role, targetUser.role);
        console.log(`🔍 ${user.role} → ${targetUser.role} = ${directType}`);
      const inverseType = await this.determineRelationType(targetUser.role, user.role);
        console.log(`🔍 ${targetUser.role} → ${user.role} = ${inverseType}`);

      if (directType !== 'impossible') {
        relations.push({
          userFrom: user,
          userTo: targetUser,
          relationType: directType as RelationList,
          relationState: 'current',
        });
      }

      if (inverseType !== 'impossible') {
        relations.push({
          userFrom: targetUser,
          userTo: user,
          relationType: inverseType as RelationList,
          relationState: 'current',
        });
      }
    }

    console.log('📎 Relations générées :', relations);

    if (relations.length > 0) {
      await this.userRelationRepository.save(relations);
    }

    if (targetUsers.length > 0) {
      const message = `Un nouvel utilisateur : ${user.pseudo} de type ${user.role} vient de s'enregistrer`;

      await this.notificationsService.createNotification({
        userIds: targetUsers.map((u) => u.id),
        type: 'message',
        message,
      });
    }
  }
        
  private getTargetRolesFor(role: string): string[] {
    const map: Record<string, string[]> = {
      pedagogical_manager: ['teacher', 'pedagogical_animator', 'pedagogical_manager'],
      teacher: ['pedagogical_manager'],
      pedagogical_animator: ['pedagogical_manager'],
    };
    return map[role] ?? [];
  }

  /**
   * Determine the relation type based on roles.
   */
  async determineRelationType(userRoleTo: RoleList, userRoleFrom: RoleList): Promise<RelationList> {
    switch (userRoleTo) {
      case 'student':
        return userRoleFrom === 'parent'
          ? 'is_child_of'
          : userRoleFrom === 'teacher'
          ? 'is_pupil_of'
          : userRoleFrom === 'pedagogical_animator'
          ? 'is_animated_by'
          : userRoleFrom === 'pedagogical_manager'
          ? 'is_managed_by'
          : 'impossible';
      case 'parent':
        return userRoleFrom === 'student'
          ? 'is_parent_of'
          : userRoleFrom === 'teacher'
          ? 'is_pupil_of'
          : userRoleFrom === 'pedagogical_animator'
          ? 'is_animated_by'
          : userRoleFrom === 'pedagogical_manager'
          ? 'is_managed_by'
          : 'impossible';
      case 'teacher':
        return userRoleFrom === 'student'
          ? 'is_teacher_of'
          : userRoleFrom === 'pedagogical_animator'
            ? 'is_animated_by'
          : userRoleFrom === 'pedagogical_manager'
            ? 'is_managed_by'
          : 'impossible';
      case 'pedagogical_animator':
        return userRoleFrom === 'student' || userRoleFrom === 'teacher' ? 'is_animator_of' : 'impossible';
      case 'pedagogical_manager':
        return userRoleFrom === 'student' || userRoleFrom === 'parent' || userRoleFrom === 'teacher' ? 'is_manager_of' : 'impossible';
      default:
        return 'impossible';
    }
  }

  /**
   * Update user relation by ID.
   */
  async updateRelation(relationId: number, updates: Partial<{ relationState: string }>): Promise<UserRelation> {
    const relation = await this.userRelationRepository.findOne({
      where: { id: relationId },
      relations: ['userFrom', 'userTo'],
    });

    if (!relation) {
      throw new NotFoundException(`Relation with ID ${relationId} not found`);
    }

    // Mise à jour de l'état de la relation actuelle
    Object.assign(relation, updates);
    const updatedRelation = await this.userRelationRepository.save(relation);

    // Mise à jour de la relation réciproque si la relation devient "current"
    if (updates.relationState === 'current') {
      const reciprocalRelation = await this.userRelationRepository.findOne({
        where: { userFrom: relation.userTo, userTo: relation.userFrom },
      });

      if (reciprocalRelation) {
        reciprocalRelation.relationState = 'current';
        await this.userRelationRepository.save(reciprocalRelation);
      }
    }

    return updatedRelation;
  }

  /**
   * Delete user relation by ID.
   */
  async deleteUserRelation(id: number): Promise<void> {
    const result = await this.userRelationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Relation not found');
    }
  }
}
