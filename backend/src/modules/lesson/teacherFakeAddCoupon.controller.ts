import { Controller, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {CouponRegisteredByTeacher, CouponRegisteredByTeacherName} from './couponRegisteredByTeacher.event';
import {CurrentUser} from "../auth/currentUser.decorator";


// This controller is used to simulate the addition of a coupon by a teacher.
// it does not respect the clean architecture principles etc and has to be removed when the coupon feature is implemented.
@Controller()
export class TeacherFakeAddCouponController {
    constructor(private eventEmitter: EventEmitter2) {}

    @Get('/teacher-fake-add-coupon')
    @HttpCode(HttpStatus.OK)
    async fakeAddCoupon(): Promise<void> {
        const event = new CouponRegisteredByTeacher(3, 30);

        this.eventEmitter.emit(CouponRegisteredByTeacherName, event);
    }
}
