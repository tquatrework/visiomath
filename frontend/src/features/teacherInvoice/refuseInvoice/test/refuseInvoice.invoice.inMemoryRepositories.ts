import { RefuseInvoiceRepository } from '../refuseInvoice.invoice.repository';
import { RefuseInvoiceCommand } from '../refuseInvoice.command';

export class RefuseInvoiceSuccessInMemoryRepository implements RefuseInvoiceRepository {
    async refuse(command: RefuseInvoiceCommand): Promise<void> {
        // Simule un refus réussi
        return Promise.resolve();
    }
}

export class RefuseInvoiceUnauthorizedInMemoryRepository implements RefuseInvoiceRepository {
    async refuse(command: RefuseInvoiceCommand): Promise<void> {
        throw new Error('Vous ne pouvez pas effectuer cette opération');
    }
}