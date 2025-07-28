import { GetTeacherInvoicesRepository } from '@src/features/teacherInvoice/getTeacherInvoices/getTeacherInvoices.repository';
import { GetTeacherInvoicesQueryResult } from '@src/features/teacherInvoice/getTeacherInvoices/getTeacherInvoices.queryResult';
import apiSec from '@src/utils/tokenapi.utils';
import { AxiosError } from 'axios';

export class GetTeacherInvoicesFetchRepository implements GetTeacherInvoicesRepository {
    async getTeacherInvoices(): Promise<GetTeacherInvoicesQueryResult> {
        try {
            const response = await apiSec.get('/get-teacher-invoices');
            
            // Transform the response to ensure dates are properly converted
            const teacherInvoices = response.data.map((invoice: any) => ({
                ...invoice,
                creationDate: new Date(invoice.creationDate)
            }));
            
            return { teacherInvoices };
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de récupérer les factures enseignant';
                throw new Error(message);
            }
            throw new Error('Impossible de récupérer les factures enseignant');
        }
    }
}