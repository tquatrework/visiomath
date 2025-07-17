import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TeacherFakeAddCouponController } from './teacherFakeAddCoupon.controller';

@Module({
  imports: [AuthModule],
  controllers: [TeacherFakeAddCouponController],
  providers: [],
})
export class LessonModule {}
