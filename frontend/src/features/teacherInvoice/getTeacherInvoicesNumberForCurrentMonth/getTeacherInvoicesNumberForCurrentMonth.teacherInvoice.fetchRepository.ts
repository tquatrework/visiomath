import {
    GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository
} from "@src/features/teacherInvoice/getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.teacherInvoice.repository";
import {
    GetTeacherInvoicesNumberForCurrentMonthQueryResult
} from "@src/features/teacherInvoice/getTeacherInvoicesNumberForCurrentMonth/getTeacherInvoicesNumberForCurrentMonth.queryResult";
import apiSec from "@src/utils/tokenapi.utils";
import {AxiosError} from "axios";

export class GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceFetchRepository implements GetTeacherInvoicesNumberForCurrentMonthTeacherInvoiceRepository {
    async getTeacherInvoicesNumberForCurrentMonth(): Promise<GetTeacherInvoicesNumberForCurrentMonthQueryResult> {
        try {
            const response = await apiSec.get('/teacher-invoices/current-month/count');
            return {
                number: response.data.count
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de récupérer le nombre de factures pour le mois en cours';
                throw new Error(message);
            }
            throw new Error('Impossible de récupérer le nombre de factures pour le mois en cours');
        }
    }
}