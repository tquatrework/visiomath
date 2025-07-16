import {GetTeacherPaymentInfoRepository} from "../getTeacherPaymentInfo.repository";
import {GetTeacherPaymentInfoQueryResult} from "../getTeacherPaymentInfo.queryResult";

export class GetTeacherPaymentInfoInMemoryRepository implements GetTeacherPaymentInfoRepository {
    private data: Map<number, GetTeacherPaymentInfoQueryResult> = new Map();

    async findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null> {
        return this.data.get(teacherId) || null;
    }

    seed(teacherId: number, data: GetTeacherPaymentInfoQueryResult): void {
        this.data.set(teacherId, data);
    }
}
