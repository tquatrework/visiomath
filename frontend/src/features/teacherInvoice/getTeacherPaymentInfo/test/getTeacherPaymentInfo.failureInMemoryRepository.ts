import { GetTeacherPaymentInfoRepository } from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository";
import {
    GetTeacherPaymentInfoQueryResult
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";

export class GetTeacherPaymentInfoFailureInMemoryRepository implements GetTeacherPaymentInfoRepository {
    async execute(): Promise<GetTeacherPaymentInfoQueryResult> {
        throw new Error("Impossible de récupérer les informations de paiement");
    }
}
