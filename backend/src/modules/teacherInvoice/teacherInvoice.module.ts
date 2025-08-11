import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import {GetTeacherAmountToInvoiceUsecase} from "./getTeacherAmountToInvoice/getTeacherAmountToInvoice.usecase";
import {GetTeacherAmountToInvoiceController} from "./getTeacherAmountToInvoice/getTeacherAmountToInvoice.controller";
import {GetTeacherAmountToInvoiceTeacherProfileTypeOrmRepository} from "./getTeacherAmountToInvoice/getTeacherAmountToInvoice.teacherProfile.typeOrmRepository";
import {PayTeacherInvoiceUsecase} from "./payTeacherInvoice/payTeacherInvoice.usecase";
import {PayTeacherInvoiceController} from "./payTeacherInvoice/payTeacherInvoice.controller";
import {PayTeacherInvoiceTypeOrmRepository} from "./payTeacherInvoice/payTeacherInvoice.typeOrmRepository";
import {CreateTeacherInvoiceUsecase} from "./createTeacherInvoice/createTeacherInvoice.usecase";
import {CreateTeacherInvoiceController} from "./createTeacherInvoice/createTeacherInvoice.controller";
import {CreateTeacherInvoiceTeacherInvoiceTypeOrmRepository} from "./createTeacherInvoice/createTeacherInvoice.teacherInvoice.typeOrmRepository";
import {CreateTeacherInvoiceUserTypeOrmRepository} from "./createTeacherInvoice/createTeacherInvoice.user.typeOrmRepository";
import {CreateTeacherInvoiceFileStorageImplementation} from "./createTeacherInvoice/createTeacherInvoice.fileStorageImplementation";
import {CreateTeacherInvoiceDateTimeProviderImplementation} from "./createTeacherInvoice/createTeacherInvoice.dateTimeProviderImplementation";
import { TeacherInvoice } from "./createTeacherInvoice/teacherInvoice.entity";
import { User } from "../../shared/entities/user.entity";
import {GetTeacherInvoicesUsecase} from "./getTeacherInvoices/getTeacherInvoices.usecase";
import {GetTeacherInvoicesController} from "./getTeacherInvoices/getTeacherInvoices.controller";
import {GetTeacherInvoicesTypeOrmRepository} from "./getTeacherInvoices/getTeacherInvoices.typeOrmRepository";
import {GetTeacherInvoicesUserTypeOrmRepository} from "./getTeacherInvoices/getTeacherInvoices.userTypeOrmRepository";
import { GetTeacherInvoiceDetailController } from './getTeacherInvoiceDetail/getTeacherInvoiceDetail.controller';
import { GetTeacherInvoiceDetailUsecase } from './getTeacherInvoiceDetail/getTeacherInvoiceDetail.usecase';
import { GetTeacherInvoiceDetailTeacherInvoiceTypeOrmRepository } from './getTeacherInvoiceDetail/getTeacherInvoiceDetail.teacherInvoice.typeOrmRepository';
import { GetTeacherInvoiceDetailUserTypeOrmRepository } from './getTeacherInvoiceDetail/getTeacherInvoiceDetail.user.typeOrmRepository';
import { ValidateTeacherInvoiceController } from './validateTeacherInvoice/validateTeacherInvoice.controller';
import { ValidateTeacherInvoiceUsecase } from './validateTeacherInvoice/validateTeacherInvoice.usecase';
import { ValidateTeacherInvoiceTeacherInvoiceTypeOrmRepository } from './validateTeacherInvoice/validateTeacherInvoice.teacherInvoice.typeOrmRepository';
import { ValidateTeacherInvoiceUserTypeOrmRepository } from './validateTeacherInvoice/validateTeacherInvoice.user.typeOrmRepository';
import { GetTeacherInvoicesNumberForCurrentMonthController } from './getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.controller';
import { GetTeacherInvoicesNumberForCurrentMonthUsecase } from './getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.usecase';
import { GetTeacherInvoicesNumberForCurrentMonthUserTypeOrmRepository } from './getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.user.typeOrmRepository';
import { GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceTypeOrmRepository } from './getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.typeOrmRepository';
import { RefuseTeacherInvoiceController } from './refuseTeacherInvoice/refuseTeacherInvoice.controller';
import { RefuseTeacherInvoiceUsecase } from './refuseTeacherInvoice/refuseTeacherInvoice.usecase';
import { RefuseTeacherInvoiceTeacherInvoiceTypeOrmRepository } from './refuseTeacherInvoice/refuseTeacherInvoice.teacherInvoice.typeOrmRepository';
import { RefuseTeacherInvoiceUserTypeOrmRepository } from './refuseTeacherInvoice/refuseTeacherInvoice.user.typeOrmRepository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TeacherInvoice, User])
  ],
  controllers: [
    saveTeacherPaymentInfoController,
    GetTeacherPaymentInfoController,
    GetTeacherAmountToInvoiceController,
    PayTeacherInvoiceController,
    CreateTeacherInvoiceController,
    GetTeacherInvoicesController,
    GetTeacherInvoiceDetailController,
    ValidateTeacherInvoiceController,
    GetTeacherInvoicesNumberForCurrentMonthController,
    RefuseTeacherInvoiceController
  ],
  providers: [
    SaveTeacherPaymentInfoUsecase,
    SaveTeacherPaymentInfoTypeOrmRepository,
    GetTeacherPaymentInfoUsecase,
    GetTeacherPaymentInfoTypeOrmRepository,
    IncreaseTeacherAmountToInvoiceUsecase,
    IncreaseTeacherAmountToInvoiceTypeOrmRepository,
    CouponRegisteredByTeacherListener,
    GetTeacherAmountToInvoiceUsecase,
    GetTeacherAmountToInvoiceTeacherProfileTypeOrmRepository,
    PayTeacherInvoiceUsecase,
    PayTeacherInvoiceTypeOrmRepository,
    CreateTeacherInvoiceUsecase,
    CreateTeacherInvoiceTeacherInvoiceTypeOrmRepository,
    CreateTeacherInvoiceUserTypeOrmRepository,
    CreateTeacherInvoiceFileStorageImplementation,
    CreateTeacherInvoiceDateTimeProviderImplementation,
    GetTeacherInvoicesUsecase,
    GetTeacherInvoicesTypeOrmRepository,
    GetTeacherInvoicesUserTypeOrmRepository,
    GetTeacherInvoiceDetailUsecase,
    GetTeacherInvoiceDetailTeacherInvoiceTypeOrmRepository,
    GetTeacherInvoiceDetailUserTypeOrmRepository,
    ValidateTeacherInvoiceUsecase,
    ValidateTeacherInvoiceTeacherInvoiceTypeOrmRepository,
    ValidateTeacherInvoiceUserTypeOrmRepository,
    GetTeacherInvoicesNumberForCurrentMonthUsecase,
    GetTeacherInvoicesNumberForCurrentMonthUserTypeOrmRepository,
    GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceTypeOrmRepository,
    RefuseTeacherInvoiceUsecase,
    RefuseTeacherInvoiceTeacherInvoiceTypeOrmRepository,
    RefuseTeacherInvoiceUserTypeOrmRepository
  ],
})
export class TeacherInvoiceModule {}
