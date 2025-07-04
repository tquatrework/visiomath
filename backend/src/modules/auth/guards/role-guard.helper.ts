import { RoleGuard } from './role.guards';

export function Roles(...roles: string[]) {
  return new RoleGuard(roles);
}