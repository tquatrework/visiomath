import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";

export interface GetTeacherPaymentInfoRepository {
    findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null>;
}
