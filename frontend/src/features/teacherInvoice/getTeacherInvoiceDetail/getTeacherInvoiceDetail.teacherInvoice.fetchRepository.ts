import { GetTeacherInvoiceDetailTeacherInvoiceRepository } from '@src/features/teacherInvoice/getTeacherInvoiceDetail/getTeacherInvoiceDetail.teacherInvoice.repository';
import { GetTeacherInvoiceDetailQueryResult } from '@src/features/teacherInvoice/getTeacherInvoiceDetail/getTeacherInvoiceDetail.queryResult';
import apiSec from '@src/utils/tokenapi.utils';
import { AxiosError } from 'axios';

export class GetTeacherInvoiceDetailTeacherInvoiceFetchRepository implements GetTeacherInvoiceDetailTeacherInvoiceRepository {
    async getById(id: number): Promise<GetTeacherInvoiceDetailQueryResult> {
        try {
            const response = await apiSec.get(`/get-teacher-invoice/${id}`);
            
            return {
                id: response.data.id,
                teacherName: response.data.teacherName,
                amount: response.data.amount,
                creationDate: response.data.creationDate,
                pdfFile: response.data.pdfFile,
                status: response.data.status,
                dueDate: response.data.dueDate,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de récupérer le détail de la facture';
                throw new Error(message);
            }
            throw new Error('Impossible de récupérer le détail de la facture');
        }
    }
}