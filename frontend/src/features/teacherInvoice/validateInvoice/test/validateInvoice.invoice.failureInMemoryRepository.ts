import { ValidateInvoiceRepository } from "../validateInvoice.invoice.repository";
import { ValidateInvoiceCommand } from "../validateInvoice.command";

export class ValidateInvoiceFailureInMemoryRepository implements ValidateInvoiceRepository {
  async execute(command: ValidateInvoiceCommand): Promise<void> {
    throw new Error('Vous ne pouvez pas effectuer cette opération');
  }
}