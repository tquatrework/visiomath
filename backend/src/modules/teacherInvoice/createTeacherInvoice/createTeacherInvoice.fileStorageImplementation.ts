import { Injectable } from '@nestjs/common';
import { CreateTeacherInvoiceFileStorage } from './createTeacherInvoice.fileStorage';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CreateTeacherInvoiceFileStorageImplementation implements CreateTeacherInvoiceFileStorage {
    
    private uploadDir = path.join(process.cwd(), 'uploads');
    
    constructor() {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    
    async saveFile(fileName: string, fileContent: Buffer): Promise<string> {
        const filePath = path.join(this.uploadDir, fileName);
        
        try {
            fs.writeFileSync(filePath, fileContent);
            return filePath;
        } catch (error) {

            if (error instanceof Error) {
                throw new Error(`EFailed to save file: ${error.message}`);
            }

            throw new Error('Erreur lors de la sauvegarde du fichier: une erreur inconnue est survenue');
        }
    }
}
