// src/utils/path-utils.ts
import path from 'path';
import { join} from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (metaUrl: string): string => {
  return path.dirname(fileURLToPath(metaUrl));
};

export const getFilename = (metaUrl: string): string => {
  return fileURLToPath(metaUrl);
};

// Définition du chemin vers le fichier `.env`
export const envFilePath = join(__dirname, '..', '..', '.env');