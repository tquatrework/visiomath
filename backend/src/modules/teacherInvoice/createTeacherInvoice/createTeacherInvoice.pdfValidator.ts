export class PdfValidator {
    isPdf(fileContent: Buffer): boolean {
        // PDF files start with the magic number '%PDF-'
        if (fileContent.length < 5) {
            return false;
        }
        
        const header = fileContent.slice(0, 5).toString('utf-8');
        return header === '%PDF-';
    }
}
