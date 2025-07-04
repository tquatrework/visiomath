import { IsEmail, IsString, IsBoolean, MinLength, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleList } from '../../common/utils/lists.utils';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiPropertyOptional({ description: 'email of the user' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: 'The password of the user' })
  @IsString()
  password!: string;

  @ApiPropertyOptional({ description: 'The role of the user' })
  @IsOptional()
  @IsString()
  role?: RoleList;

  @ApiPropertyOptional({ description: 'Is the user active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'The first name of the user' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'The last name of the user' })
  @IsOptional()
  @IsString()
  lastName?: string;
}