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
import {GetTeacherAmountToInvoiceTypeOrmRepository} from "./getTeacherAmountToInvoice/getTeacherAmountToInvoice.typeOrmRepository";
import {PayTeacherInvoiceUsecase} from "./payTeacherInvoice/payTeacherInvoice.usecase";
import {PayTeacherInvoiceController} from "./payTeacherInvoice/payTeacherInvoice.controller";
import {PayTeacherInvoiceTypeOrmRepository} from "./payTeacherInvoice/payTeacherInvoice.typeOrmRepository";
import {CreateTeacherInvoiceUsecase} from "./createTeacherInvoice/createTeacherInvoice.usecase";
import {CreateTeacherInvoiceController} from "./createTeacherInvoice/createTeacherInvoice.controller";
import {CreateTeacherInvoiceTypeOrmRepository} from "./createTeacherInvoice/createTeacherInvoice.typeOrmRepository";
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
    GetTeacherInvoiceDetailController
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
    GetTeacherAmountToInvoiceTypeOrmRepository,
    PayTeacherInvoiceUsecase,
    PayTeacherInvoiceTypeOrmRepository,
    CreateTeacherInvoiceUsecase,
    CreateTeacherInvoiceTypeOrmRepository,
    CreateTeacherInvoiceFileStorageImplementation,
    CreateTeacherInvoiceDateTimeProviderImplementation,
    GetTeacherInvoicesUsecase,
    GetTeacherInvoicesTypeOrmRepository,
    GetTeacherInvoicesUserTypeOrmRepository,
    GetTeacherInvoiceDetailUsecase,
    GetTeacherInvoiceDetailTeacherInvoiceTypeOrmRepository,
    GetTeacherInvoiceDetailUserTypeOrmRepository
  ],
})
export class TeacherInvoiceModule {}
