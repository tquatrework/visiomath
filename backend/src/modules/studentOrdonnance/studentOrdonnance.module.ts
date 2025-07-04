import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity';
import { StudentOrdonnanceService } from './studentOrdonnance.service';
import { StudentOrdonnanceController } from './studentOrdonnance.controller';
import { UserProfile } from '../../shared/entities/userprofile.entity';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([StudentOrdonnance, UserProfile])],
  controllers: [StudentOrdonnanceController],
  providers: [StudentOrdonnanceService],
})
export class StudentOrdonnanceModule {}
