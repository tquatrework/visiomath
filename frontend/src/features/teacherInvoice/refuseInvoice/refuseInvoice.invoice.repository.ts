import { RefuseInvoiceCommand } from './refuseInvoice.command';

export interface RefuseInvoiceRepository {
    refuse(command: RefuseInvoiceCommand): Promise<void>;
}