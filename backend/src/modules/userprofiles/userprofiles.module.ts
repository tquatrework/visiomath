import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from '../../shared/entities/userprofile.entity';
import { UserProfileService } from './userprofiles.service';
import { UserProfileController } from './userprofiles.controller';
import { User } from '../../shared/entities/user.entity';
import { StudentProfile } from '../../shared/entities/studentProfile.entity';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity';


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