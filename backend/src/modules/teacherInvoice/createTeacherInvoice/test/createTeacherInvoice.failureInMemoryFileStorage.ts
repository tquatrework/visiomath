import { CreateTeacherInvoiceFileStorage } from '../createTeacherInvoice.fileStorage';

export class CreateTeacherInvoiceFailureInMemoryFileStorage implements CreateTeacherInvoiceFileStorage {

  async saveFile(originalFileName: string, fileContent: Buffer): Promise<string> {
    throw new Error("La facture n'a pas pu être créée");
  }
}
