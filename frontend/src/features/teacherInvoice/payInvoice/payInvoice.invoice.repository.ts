import { PayInvoiceCommand } from './payInvoice.command';

export interface PayInvoiceInvoiceRepository {
  payInvoice(command: PayInvoiceCommand): Promise<void>;
}