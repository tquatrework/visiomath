// guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    // Vérifie si le token est invalidé
    const isTokenInvalid = await this.authService.isTokenInvalid(token);
    if (isTokenInvalid) {
      throw new UnauthorizedException('Token is invalidated');
    }

    try {
      // Vérifie si le token est valide (vérification de sa signature et expiration)
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }

    // Appelle la méthode de validation du guard parent
    const parentResult = await super.canActivate(context); // Assure un résultat boolean ou Promise<boolean>
    return parentResult as boolean;
  }

  handleRequest(err: Error, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}