import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthModule } from '../auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';
import { UserProfileService } from './userprofiles.service.js';
import { UserProfileController } from './userprofiles.controller.js';
import { User } from '../../shared/entities/user.entity.js';
import { StudentProfile } from '../../shared/entities/studentProfile.entity.js';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity.js';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity.js';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity.js';


@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([
            UserProfile,
            User,
            StudentProfile,
            TeacherProfile,
            StudentOrdonnance,
            TeacherOrdonnance]),
    MulterModule.register({
      dest: './datafiles/vma_images',
    }),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfilesModule {}