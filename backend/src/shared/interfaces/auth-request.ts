// src/types/auth-request.ts
import { Request } from 'express';
import { User } from '../entities/user.entity';

export interface AuthRequest extends Request {
  user?: User; // le ? indique que user peut être indéfini
}