// src/user-relations/dto/create-userrelation.dto.ts
import { IsEnum, IsInt, IsIn, IsNotEmpty } from 'class-validator';
import { relationList, RelationList } from '../../common/utils/lists.utils.js';
import { relationState, RelationState } from '../../common/utils/lists.utils.js';

export class CreateUserRelationDto {
  constructor(userFrom: number, userTo: number, relationType: RelationList, relationState: RelationState) { 
    this.userFrom = userFrom;
    this.userTo = userTo;
    this.relationType = relationType;
    this.relationState = relationState;
  }
  @IsInt()
  @IsNotEmpty()
  userFrom: number;  // ID de l'utilisateur initiateur

  @IsInt()
  @IsNotEmpty()
  userTo: number;  // ID de l'utilisateur cible

  @IsIn(relationList) 
  @IsNotEmpty()
  relationType: RelationList;  // Type de la relation

  @IsIn(relationState) 
  @IsNotEmpty()
  relationState: RelationState;  // Etat de la relation
}
