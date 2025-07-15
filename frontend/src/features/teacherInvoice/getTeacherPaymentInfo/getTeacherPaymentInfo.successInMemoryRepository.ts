import {
    GetTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository";
import {
    GetTeacherPaymentInfoQueryResult
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";


export class GetTeacherPaymentInfoSuccessInMemoryRepository implements GetTeacherPaymentInfoRepository {
    
    constructor(private mockPaymentInfo: GetTeacherPaymentInfoQueryResult) {}
    
    async execute(): Promise<GetTeacherPaymentInfoQueryResult> {
        return this.mockPaymentInfo;
    }

}
