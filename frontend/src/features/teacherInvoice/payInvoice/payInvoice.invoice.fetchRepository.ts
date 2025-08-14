import { PayInvoiceInvoiceRepository } from '@src/features/teacherInvoice/payInvoice/payInvoice.invoice.repository';
import apiSec from '@src/utils/tokenapi.utils';
import { AxiosError } from 'axios';
import { PayInvoiceCommand } from '@src/features/teacherInvoice/payInvoice/payInvoice.command';

export class PayInvoiceFetchRepository implements PayInvoiceInvoiceRepository {
    async payInvoice(command: PayInvoiceCommand): Promise<void> {
        try {
            await apiSec.put(`/pay-teacher-invoice/${command.invoiceId}`, { 
                teacherInvoiceId: command.invoiceId
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de payer la facture';
                throw new Error(message);
            }
            throw new Error('Impossible de payer la facture');
        }
    }
}