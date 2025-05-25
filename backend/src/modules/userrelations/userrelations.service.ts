import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { UserRelation } from '../../shared/entities/userrelation.entity.js';
import { RelationList, RelationState, RoleList } from '../../common/utils/lists.utils.js';
import { User } from '../../shared/entities/user.entity.js';
import { CreateUserRelationDto } from '../../shared/dto/create-userrelation.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class UserRelationsService {
  constructor(
    @InjectRepository(UserRelation)
    private readonly userRelationRepository: Repository<UserRelation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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
          : 'impossible';
      case 'pedagogical_animator':
        return userRoleFrom === 'student' || userRoleFrom === 'teacher' ? 'is_animator_of' : 'impossible';
      case 'pedagogical_manager':
        return userRoleFrom === 'student' || userRoleFrom === 'parent' ? 'is_manager_of' : 'impossible';
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
