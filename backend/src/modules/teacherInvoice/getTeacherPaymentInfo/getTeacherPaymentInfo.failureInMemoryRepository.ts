import {GetTeacherPaymentInfoRepository} from "./getTeacherPaymentInfo.repository";
import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";

export class GetTeacherPaymentInfoFailureInMemoryRepository implements GetTeacherPaymentInfoRepository {
    
    async findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null> {
        throw new Error("xxxx");
    }
}
