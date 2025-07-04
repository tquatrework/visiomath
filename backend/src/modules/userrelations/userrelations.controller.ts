import { 
  Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, UseGuards, BadRequestException,
  HttpException, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserRelationsService } from './userrelations.service';
import { CreateUserRelationDto } from '../../shared/dto/create-userrelation.dto';
import { RelationList, RelationState } from '../../common/utils/lists.utils';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User Relations')
@UseGuards(JwtAuthGuard)
@Controller('userrelations')
export class UserRelationsController {
  constructor(
    private readonly userRelationsService: UserRelationsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Retrieve user relations with optional filters.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve user relations with optional filters' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'direction', description: 'Direction of the relation (from or to)', required: true })
  @ApiQuery({ name: 'relationType', description: 'Filter by relation type', required: false })
  @ApiQuery({ name: 'relationState', description: 'Filter by relation state', required: false })
  @ApiResponse({ status: 200, description: 'User relations retrieved successfully.' })
  async getUserRelations(
      @Query('userId', ParseIntPipe) userId: string,
      @Query('direction') direction: 'from' | 'to',
      @Query('relationType') relationType?: RelationList,
      @Query('relationState') relationState?: RelationState,
  ) {
      if (direction === 'from') {
          return this.userRelationsService.getUserFromRelations(parseInt(userId), relationType, relationState);
      } else if (direction === 'to') {
          return this.userRelationsService.getUserToRelations(parseInt(userId), relationType, relationState);
      } else {
          throw new BadRequestException('Invalid direction value. Use "from" or "to".');
      }
  }

  /**
   * Create a new user relation.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user relation' })
  @ApiResponse({ status: 201, description: 'User relation created successfully.' })
  async createUserRelation(@Body() createUserRelationDto: CreateUserRelationDto) {
    return this.userRelationsService.createUserRelation(createUserRelationDto);
  }

  /**
   * Create a new user relation by pseudo.
   */
  @Post('pseudo')
  @ApiOperation({ summary: 'Create a new user relation by pseudo' })
  @ApiResponse({ status: 201, description: 'User relation created successfully by pseudo.' })
  async createUserRelationByPseudo(
    @Body() { connectedUserId, connectedUserRole, userPseudo, isRequest = true, isSymetricRequest = false }: any,
  ) {
    const userToEntity = await this.usersService.findByPseudo(userPseudo);
    if (!userToEntity) {
      throw new BadRequestException(`User with pseudo "${userPseudo}" not found`);
    }

    const directRelationType = await this.userRelationsService.determineRelationType(connectedUserRole, userToEntity.role);
    const inverseRelationType = await this.userRelationsService.determineRelationType(userToEntity.role, connectedUserRole);

    if (!directRelationType || !inverseRelationType || directRelationType === 'impossible' || inverseRelationType === 'impossible') {
      throw new BadRequestException('Invalid relation type');
    }

    const relationState = isSymetricRequest ? 'requestedBack' : isRequest ? 'requested' : 'current';

    await this.userRelationsService.createUserRelation({
      userFrom: connectedUserId,
      userTo: userToEntity.id,
      relationType: directRelationType,
      relationState,
    });

    await this.userRelationsService.createUserRelation({
      userFrom: userToEntity.id,
      userTo: connectedUserId,
      relationType: inverseRelationType,
      relationState: isRequest ? 'requestedBack' : 'current',
    });

    return { message: `Relations created with state: ${relationState}` };
  }

  /**
   * Create a new user relation by email.
   */
  @Post('email')
  @ApiOperation({ summary: 'Create a new user relation by email' })
  @ApiResponse({ status: 201, description: 'User relation created successfully by email.' })
  async createUserRelationByEmail(@Body() { connectedUserId, connectedUserRole, userMail, isRequest = true }: any) {
    const userToEntity = await this.usersService.findByEmail(userMail);
    if (!userToEntity) {
      throw new BadRequestException(`User with email "${userMail}" not found`);
    }

    const directRelationType = await this.userRelationsService.determineRelationType(connectedUserRole, userToEntity.role);
    const inverseRelationType = await this.userRelationsService.determineRelationType(userToEntity.role, connectedUserRole);

    if (!directRelationType || !inverseRelationType || directRelationType === 'impossible' || inverseRelationType === 'impossible') {
      throw new BadRequestException('Invalid relation type');
    }

    await this.userRelationsService.createUserRelation({
      userFrom: connectedUserId,
      userTo: userToEntity.id,
      relationType: directRelationType,
      relationState: isRequest ? 'requested' : 'current',
    });

    await this.userRelationsService.createUserRelation({
      userFrom: userToEntity.id,
      userTo: connectedUserId,
      relationType: inverseRelationType,
      relationState: isRequest ? 'requestedBack' : 'current',
    });

    return { message: 'User relation created successfully by email.' };
  }

  /**
   * Update user relation by ID.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update user relation by ID' })
  @ApiResponse({ status: 200, description: 'User relation updated successfully.' })
  async updateRelation(
    @Param('id') relationId: number,
    @Body() updates: Partial<{ relationState: string }>,
  ) {
    const updatedRelation = await this.userRelationsService.updateRelation(relationId, updates);
    if (!updatedRelation) {
      throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
    }
    return updatedRelation;
  }

  /**
   * Delete user relation by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user relation by ID' })
  @ApiResponse({ status: 204, description: 'User relation deleted successfully.' })
  async deleteUserRelation(@Param('id') id: number) {
    return this.userRelationsService.deleteUserRelation(id);
  }
}
