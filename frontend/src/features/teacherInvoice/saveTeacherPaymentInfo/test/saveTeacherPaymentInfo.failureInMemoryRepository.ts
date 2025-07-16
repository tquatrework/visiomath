import {
    SaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository";
import {
    TeacherPaymentInfosCommand
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.command";


export class SaveTeacherPaymentInfoFailureInMemoryRepository implements SaveTeacherPaymentInfoRepository {
    async execute (teacherPaymentInfo: TeacherPaymentInfosCommand): Promise<void> {
        if (teacherPaymentInfo.siret.length < 14) {
            throw new Error("Le SIRET doit contenir 14 caractères");
        }
    }

}
