
export const CouponRegisteredByTeacherName = 'coupon.registered.by.teacher';

export class CouponRegisteredByTeacher {
    public readonly occurredAt: Date;
    public readonly teacherId: number;
    public readonly amount: number;

    constructor(teacherId: number, amount: number) {
        this.teacherId = teacherId;
        this.amount = amount;
        this.occurredAt = new Date();
    }
}
