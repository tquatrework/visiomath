import { ValidateInvoiceRepository } from "../validateInvoice.invoice.repository";
import { ValidateInvoiceCommand } from "../validateInvoice.command";

export class ValidateInvoiceSuccessInMemoryRepository implements ValidateInvoiceRepository {
  async execute(command: ValidateInvoiceCommand): Promise<void> {
    // Simulation d'une validation réussie - ne fait rien
  }
}