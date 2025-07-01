import {
    TeacherPaymentInfosModel
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.model";
import {
    SaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository";


export class TeacherPaymentInfoInMemoryRepository implements SaveTeacherPaymentInfoRepository {
    async execute (teacherPaymentInfo: TeacherPaymentInfosModel): Promise<void> {
        console.log('Saving teacher payment info:', teacherPaymentInfo);
    }

}

