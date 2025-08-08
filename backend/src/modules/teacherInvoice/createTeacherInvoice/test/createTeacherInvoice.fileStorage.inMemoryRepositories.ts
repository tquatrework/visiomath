import { CreateTeacherInvoiceFileStorage } from '../createTeacherInvoice.fileStorage';

export class CreateTeacherInvoiceFileStorageSuccessInMemoryRepository implements CreateTeacherInvoiceFileStorage {
  savedFiles: Array<{ originalName: string, content: Buffer, savedPath: string }> = [];

  async saveFile(originalFileName: string, fileContent: Buffer): Promise<string> {
    const savedPath = `/uploads/${originalFileName}`;
    
    this.savedFiles.push({
      originalName: originalFileName,
      content: fileContent,
      savedPath
    });
    
    return savedPath;
  }
}

export class CreateTeacherInvoiceFileStorageFailureInMemoryRepository implements CreateTeacherInvoiceFileStorage {
  async saveFile(originalFileName: string, fileContent: Buffer): Promise<string> {
    throw new Error("La facture n'a pas pu être créée");
  }
}