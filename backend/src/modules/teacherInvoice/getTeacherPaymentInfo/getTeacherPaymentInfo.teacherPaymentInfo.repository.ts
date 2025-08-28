import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";

export interface GetTeacherPaymentInfoTeacherPaymentInfoRepository {
    findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null>;
}