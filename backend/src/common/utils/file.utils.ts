import { Buffer } from 'buffer';
import { Readable } from 'stream';
import { UploadedFileType } from '../../shared/interfaces/uploaded-file-type';

export function createDefaultUploadedFile( id: number, userId: number, filename: string): UploadedFileType {
  const defaultStream = new Readable({
    read() {}, // Flux vide
  });

  return {
    fieldname: 'file', // Valeur par défaut
    originalname: filename, // Utiliser le nom donné
    encoding: '7bit', // Valeur par défaut
    mimetype: 'application/octet-stream', // Valeur générique
    buffer: Buffer.from(''), // Buffer vide par défaut
    size: 0, // Taille par 
    stream : defaultStream,
    destination : './datafiles',
    path : './datafiles/default.pdf',
    id,
    userId,
    filename,
  };
}