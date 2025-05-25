import { Express } from 'express';

export interface UploadedFileType extends Express.Multer.File {
  // Vous pouvez ajouter des propriétés spécifiques si nécessaire
  id: number;
  userId: number;
  filename: string;
  category?: string;
  subcategory?: string;
  comment?: string;
}
