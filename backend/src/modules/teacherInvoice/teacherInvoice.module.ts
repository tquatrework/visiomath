import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {SaveTeacherPaymentInfoUsecase} from "./saveTeacherPaymentInfo/saveTeacherPaymentInfo.usecase";
import {saveTeacherPaymentInfoController} from "./saveTeacherPaymentInfo/saveTeacherPaymentInfo.controller";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [saveTeacherPaymentInfoController],
  providers: [SaveTeacherPaymentInfoUsecase],
})
export class TeacherInvoiceModule {}
