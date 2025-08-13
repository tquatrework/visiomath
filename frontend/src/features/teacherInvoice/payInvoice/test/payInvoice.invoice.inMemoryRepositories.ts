import { PayInvoiceInvoiceRepository } from '../payInvoice.invoice.repository';
import { PayInvoiceCommand } from '../payInvoice.command';

export class PayInvoiceInvoiceSuccessInMemoryRepository implements PayInvoiceInvoiceRepository {
  async payInvoice(command: PayInvoiceCommand): Promise<void> {
    return Promise.resolve();
  }
}

export class PayInvoiceInvoiceUnauthorizedInMemoryRepository implements PayInvoiceInvoiceRepository {
  async payInvoice(command: PayInvoiceCommand): Promise<void> {
    throw new Error('Vous ne pouvez pas effectuer cette opération');
  }
}