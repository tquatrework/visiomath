import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity';
import { TeacherOrdonnanceService } from './teacherOrdonnance.service';
import { TeacherOrdonnanceController } from './teacherOrdonnance.controller';
import { UserProfile } from '../../shared/entities/userprofile.entity';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([TeacherOrdonnance, UserProfile])],
  controllers: [TeacherOrdonnanceController],
  providers: [TeacherOrdonnanceService],
})
export class TeacherOrdonnanceModule {}
