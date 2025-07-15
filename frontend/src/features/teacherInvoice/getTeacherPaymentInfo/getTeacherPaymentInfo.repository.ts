import {
    GetTeacherPaymentInfoQueryResult
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";

export interface GetTeacherPaymentInfoRepository {
    execute(): Promise<GetTeacherPaymentInfoQueryResult>
}
