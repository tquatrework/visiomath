import { ValidateInvoiceRepository } from '@src/features/teacherInvoice/validateInvoice/validateInvoice.invoice.repository';
import apiSec from '@src/utils/tokenapi.utils';
import { AxiosError } from 'axios';
import { ValidateInvoiceCommand } from '@src/features/teacherInvoice/validateInvoice/validateInvoice.command';

export class ValidateInvoiceFetchRepository implements ValidateInvoiceRepository {
    async execute(command: ValidateInvoiceCommand): Promise<void> {
        try {
            await apiSec.put(`/validate-teacher-invoice/${command.invoiceId}`, command);
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible de valider la facture';
                throw new Error(message);
            }
            throw new Error('Impossible de valider la facture');
        }
    }
}