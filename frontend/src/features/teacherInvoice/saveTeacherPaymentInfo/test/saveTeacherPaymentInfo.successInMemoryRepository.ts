import {
    SaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository";
import {
    TeacherPaymentInfosCommand
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.command";


export class SaveTeacherPaymentInfoSuccessInMemoryRepository implements SaveTeacherPaymentInfoRepository {
    async execute (teacherPaymentInfo: TeacherPaymentInfosCommand): Promise<void> {
    }

}
