import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule} from '../auth/auth.module.js';
import { StudentProfile } from '../../shared/entities/studentProfile.entity.js';
import { StudentProfileController } from './studentProfile.controller.js';
import { StudentProfileService } from './studentProfile.service.js';
import { UserProfile } from '../../shared/entities/userprofile.entity.js';


@Module({
    imports: [AuthModule,
        TypeOrmModule.forFeature([StudentProfile, UserProfile])],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [StudentProfileService],
})
export class StudentProfileModule {}
