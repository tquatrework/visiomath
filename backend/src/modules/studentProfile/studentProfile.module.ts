import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule} from '../auth/auth.module';
import { StudentProfile } from '../../shared/entities/studentProfile.entity';
import { StudentProfileController } from './studentProfile.controller';
import { StudentProfileService } from './studentProfile.service';
import { UserProfile } from '../../shared/entities/userprofile.entity';


@Module({
    imports: [AuthModule,
        TypeOrmModule.forFeature([StudentProfile, UserProfile])],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [StudentProfileService],
})
export class StudentProfileModule {}
