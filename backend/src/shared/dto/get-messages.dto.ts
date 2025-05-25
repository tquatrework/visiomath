import { IsOptional, IsEnum } from 'class-validator';

export class GetMessagesDto {
  @IsEnum(['date', 'userrelation'])
  @IsOptional()
  filter?: string;

  @IsOptional()
  userId?: number;

  @IsOptional()
  date?: string;
}
