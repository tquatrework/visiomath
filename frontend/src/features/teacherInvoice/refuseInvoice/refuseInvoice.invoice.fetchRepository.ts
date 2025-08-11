import { RefuseInvoiceRepository } from '@src/features/teacherInvoice/refuseInvoice/refuseInvoice.invoice.repository';
import apiSec from '@src/utils/tokenapi.utils';
import { AxiosError } from 'axios';
import { RefuseInvoiceCommand } from '@src/features/teacherInvoice/refuseInvoice/refuseInvoice.command';

export class RefuseInvoiceFetchRepository implements RefuseInvoiceRepository {
    async refuse(command: RefuseInvoiceCommand): Promise<void> {
        try {
            await apiSec.put(`/refuse-teacher-invoice/${command.invoiceId}`, { 
                invoiceId: command.invoiceId,
                refusalReason: command.refusalReason 
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de refuser la facture';
                throw new Error(message);
            }
            throw new Error('Impossible de refuser la facture');
        }
    }
}