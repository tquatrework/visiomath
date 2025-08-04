import { ValidateInvoiceCommand } from "./validateInvoice.command";

export interface ValidateInvoiceRepository {
  execute(command: ValidateInvoiceCommand): Promise<void>;
}