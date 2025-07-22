
export interface CreateTeacherInvoiceFileStorage {

  saveFile(originalFileName: string, fileContent: Buffer): Promise<string>;
}
