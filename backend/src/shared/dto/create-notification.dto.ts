import { IsString, IsNumber, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../../common/utils/lists.utils';

export class CreateNotificationDto {
  // PERMET LA CREATION SIMULTANEE DU LIEN NOTIFICATION/USER
  @ApiProperty({
  description: 'IDs des utilisateurs associés à la notification',
  example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  userIds!: number[];

  @ApiProperty({
    description: 'Message de la notification',
    example: 'Votre compte a été mis à jour.',
  })
  @IsString()
  @IsNotEmpty()
  message: string='';

  @ApiProperty({
    description: 'Type de notification, utilisé pour déterminer l\'action associée',
    example: 'USER_UPDATE',
  })
  @IsString()
  @IsNotEmpty()
  type!: NotificationType;

  @ApiPropertyOptional({
    description: 'ActionLabel associée à la notification (facultatif)',
    example: 'Voir le profil',
  })
  @IsString()
  @IsOptional()
  actionLabel?: string;

  @ApiPropertyOptional({
    description: 'URL associée à la notification (facultatif)',
    example: '/user/profile',
  })
  @IsString()
  @IsOptional()
  url?: string;
    
  @ApiPropertyOptional({
    description: 'Paramètres supplémentaires pour l\'action associée',
    example: { key1: 'value1', key2: 'value2' },
   })
   @IsOptional()
   @IsNotEmpty()
  params?: Record<string, any>;
  
   @ApiPropertyOptional({
    description: 'Mode d\'action associée à la notification (facultatif) : mono, multi, total',
    example: '/user/profile',
  })
  @IsString()
  @IsOptional()
  actionMode?: string; 
    
}
