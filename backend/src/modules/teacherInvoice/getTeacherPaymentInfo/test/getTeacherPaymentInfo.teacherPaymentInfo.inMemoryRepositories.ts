import {GetTeacherPaymentInfoQueryResult} from "../getTeacherPaymentInfo.queryResult";
import {GetTeacherPaymentInfoTeacherPaymentInfoRepository} from "../getTeacherPaymentInfo.teacherPaymentInfo.repository";

export class GetTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository implements GetTeacherPaymentInfoTeacherPaymentInfoRepository {
    private data: Map<number, GetTeacherPaymentInfoQueryResult> = new Map();

    async findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null> {
        return this.data.get(teacherId) || null;
    }

    seed(teacherId: number, data: GetTeacherPaymentInfoQueryResult): void {
        this.data.set(teacherId, data);
    }
}

export class GetTeacherPaymentInfoTeacherPaymentInfoFailureInMemoryRepository implements GetTeacherPaymentInfoTeacherPaymentInfoRepository {
    async findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null> {
        throw new Error("xxxx");
    }
}