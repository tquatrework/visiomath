import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity.js';
import { StudentOrdonnanceService } from './studentOrdonnance.service.js';
import { StudentOrdonnanceController } from './studentOrdonnance.controller.js';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([StudentOrdonnance, UserProfile])],
  controllers: [StudentOrdonnanceController],
  providers: [StudentOrdonnanceService],
})
export class StudentOrdonnanceModule {}
