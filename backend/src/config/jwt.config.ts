// jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
//export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'VincentThierry',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));