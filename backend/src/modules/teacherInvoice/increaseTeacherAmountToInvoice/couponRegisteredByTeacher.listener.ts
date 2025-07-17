import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {CouponRegisteredByTeacher, CouponRegisteredByTeacherName} from '../../lesson/couponRegisteredByTeacher.event';
import { IncreaseTeacherAmountToInvoiceUsecase } from './increaseTeacherAmountToInvoice.usecase';

@Injectable()
export class CouponRegisteredByTeacherListener {
    constructor(
        private readonly increaseTeacherAmountToInvoiceUsecase: IncreaseTeacherAmountToInvoiceUsecase
    ) {}

    @OnEvent(CouponRegisteredByTeacherName)
    async handleCouponRegisteredByTeacher(event: CouponRegisteredByTeacher): Promise<void> {
        const teacherId = event.teacherId;
        const command = { amount: event.amount };
        
        await this.increaseTeacherAmountToInvoiceUsecase.execute(teacherId, command);
    }
}
