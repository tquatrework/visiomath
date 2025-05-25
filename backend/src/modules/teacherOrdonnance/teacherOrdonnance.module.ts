import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity.js';
import { TeacherOrdonnanceService } from './teacherOrdonnance.service.js';
import { TeacherOrdonnanceController } from './teacherOrdonnance.controller.js';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([TeacherOrdonnance, UserProfile])],
  controllers: [TeacherOrdonnanceController],
  providers: [TeacherOrdonnanceService],
})
export class TeacherOrdonnanceModule {}
