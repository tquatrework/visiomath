import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: { id: number; name: string }; // Exemple d'ajout de l'utilisateur
}