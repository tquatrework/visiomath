import { RoleGuard } from './role.guards.js';

export function Roles(...roles: string[]) {
  return new RoleGuard(roles);
}