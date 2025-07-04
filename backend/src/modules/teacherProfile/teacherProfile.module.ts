import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity';
import { TeacherProfileService } from './teacherProfile.service';
import { TeacherProfileController } from './teacherProfile.controller';
import { UserProfile } from '../../shared/entities/userprofile.entity';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([TeacherProfile, UserProfile])],
  controllers: [TeacherProfileController],
  providers: [TeacherProfileService],
})
export class TeacherProfileModule {}
