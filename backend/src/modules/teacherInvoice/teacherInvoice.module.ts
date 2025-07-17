import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {SaveTeacherPaymentInfoUsecase} from "./saveTeacherPaymentInfo/saveTeacherPaymentInfo.usecase";
import {saveTeacherPaymentInfoController} from "./saveTeacherPaymentInfo/saveTeacherPaymentInfo.controller";
import {SaveTeacherPaymentInfoTypeOrmRepository} from "./saveTeacherPaymentInfo/saveTeacherPaymentInfo.typeOrmRepository";
import {GetTeacherPaymentInfoUsecase} from "./getTeacherPaymentInfo/getTeacherPaymentInfo.usecase";
import {GetTeacherPaymentInfoController} from "./getTeacherPaymentInfo/getTeacherPaymentInfo.controller";
import {GetTeacherPaymentInfoTypeOrmRepository} from "./getTeacherPaymentInfo/getTeacherPaymentInfo.typeOrmRepository";
import {IncreaseTeacherAmountToInvoiceUsecase} from "./increaseTeacherAmountToInvoice/increaseTeacherAmountToInvoice.usecase";
import {IncreaseTeacherAmountToInvoiceTypeOrmRepository} from "./increaseTeacherAmountToInvoice/increaseTeacherAmountToInvoice.typeOrmRepository";
import {CouponRegisteredByTeacherListener} from "./increaseTeacherAmountToInvoice/couponRegisteredByTeacher.listener";

@Module({
  imports: [AuthModule],
  controllers: [
    saveTeacherPaymentInfoController,
    GetTeacherPaymentInfoController
  ],
  providers: [
    SaveTeacherPaymentInfoUsecase,
    SaveTeacherPaymentInfoTypeOrmRepository,
    GetTeacherPaymentInfoUsecase,
    GetTeacherPaymentInfoTypeOrmRepository,
    IncreaseTeacherAmountToInvoiceUsecase,
    IncreaseTeacherAmountToInvoiceTypeOrmRepository,
    CouponRegisteredByTeacherListener
  ],
})
export class TeacherInvoiceModule {}
