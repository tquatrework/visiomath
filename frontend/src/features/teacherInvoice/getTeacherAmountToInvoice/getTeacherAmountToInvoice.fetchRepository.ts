import {
    GetTeacherAmountToInvoiceRepository
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.repository";
import {
    GetTeacherAmountToInvoiceQueryResult
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.queryResult";
import apiSec from "@src/utils/tokenapi.utils";
import {AxiosError} from "axios";

export class GetTeacherAmountToInvoiceFetchRepository implements GetTeacherAmountToInvoiceRepository {
    async execute(): Promise<GetTeacherAmountToInvoiceQueryResult> {
        try {
            const response = await apiSec.get('/teacher-amount-to-invoice');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de récupérer le montant à facturer';
                throw new Error(message);
            }
            throw new Error('Impossible de récupérer le montant à facturer');
        }
    }
}
