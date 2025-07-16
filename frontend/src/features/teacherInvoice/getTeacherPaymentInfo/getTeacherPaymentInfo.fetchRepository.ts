import {
    GetTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository";
import {
    GetTeacherPaymentInfoQueryResult
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";
import apiSec from "@src/utils/tokenapi.utils";
import {AxiosError} from "axios";

export class GetTeacherPaymentInfoFetchRepository implements GetTeacherPaymentInfoRepository {
    async execute(): Promise<GetTeacherPaymentInfoQueryResult> {
        try {
            const response = await apiSec.get('/teacher-payment-info');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de récupérer les informations de paiement';
                throw new Error(message);
            }
            throw new Error('Impossible de récupérer les informations de paiement');
        }
    }
}
