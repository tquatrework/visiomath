import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly allowedRoles: string[];

  constructor(allowedRoles: string[]) {
    this.allowedRoles = allowedRoles;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false; // Si l'utilisateur n'est pas authentifié
    return this.allowedRoles.includes(user.role); // Vérifie si le rôle est autorisé
  }
}
