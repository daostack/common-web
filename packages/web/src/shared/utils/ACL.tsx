import { User } from "../models";
import { tokenHandler } from "../utils";

export const getUserPermissions = (): string[] => {
  const user: User = tokenHandler.getUser();
  if (!user || !user.roles) {
    return [];
  }

  const permissions: string[] = [];
  user.roles.forEach((r) => {
    permissions.push(...r.permissions.map((p) => p.name));
  });

  return permissions;
};

export const checkPermissions = (permission: string[]): boolean => {
  const userPermissions = getUserPermissions();
  return permission.every((p) => userPermissions.includes(p));
};
