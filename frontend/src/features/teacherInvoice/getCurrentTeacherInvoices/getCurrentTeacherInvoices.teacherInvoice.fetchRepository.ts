import {
    GetCurrentTeacherInvoicesTeacherInvoiceRepository
} from "@src/features/teacherInvoice/getCurrentTeacherInvoices/getCurrentTeacherInvoices.teacherInvoice.repository";
import {
    GetCurrentTeacherInvoicesQueryResult
} from "@src/features/teacherInvoice/getCurrentTeacherInvoices/getCurrentTeacherInvoices.queryResult";
import apiSec from "@src/utils/tokenapi.utils";
import {AxiosError} from "axios";

export class GetCurrentTeacherInvoicesTeacherInvoiceFetchRepository implements GetCurrentTeacherInvoicesTeacherInvoiceRepository {
    async getCurrentTeacherInvoices(): Promise<GetCurrentTeacherInvoicesQueryResult> {
        try {
            const response = await apiSec.get('/current-teacher-invoices');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de récupérer les factures';
                throw new Error(message);
            }
            throw new Error('Impossible de récupérer les factures');
        }
    }
}