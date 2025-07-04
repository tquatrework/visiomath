// shared/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleList } from '../../common/utils/lists.utils';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string = '';

  @ApiProperty({
    example: 'password123',
    description: 'Password for the account',
    minimum: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string = '';

  @ApiPropertyOptional({ description: 'The role of the user' })
  @IsOptional()
  @IsString()
  role?: RoleList;

  @ApiPropertyOptional({
    example: 'John',
    description: 'First name of the user',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}