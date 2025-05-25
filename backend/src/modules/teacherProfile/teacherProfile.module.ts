import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity.js';
import { TeacherProfileService } from './teacherProfile.service.js';
import { TeacherProfileController } from './teacherProfile.controller.js';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([TeacherProfile, UserProfile])],
  controllers: [TeacherProfileController],
  providers: [TeacherProfileService],
})
export class TeacherProfileModule {}
