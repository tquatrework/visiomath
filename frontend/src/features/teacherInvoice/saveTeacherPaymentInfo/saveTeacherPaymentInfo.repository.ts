import {
    TeacherPaymentInfosModel
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.model";

export interface SaveTeacherPaymentInfoRepository {
    execute(teacherPaymentInfo: TeacherPaymentInfosModel): Promise<void>
}