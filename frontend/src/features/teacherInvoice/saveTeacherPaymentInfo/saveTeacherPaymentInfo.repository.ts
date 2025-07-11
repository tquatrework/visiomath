import {
    TeacherPaymentInfosCommand
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.command";

export interface SaveTeacherPaymentInfoRepository {
    execute(teacherPaymentInfo: TeacherPaymentInfosCommand): Promise<void>
}