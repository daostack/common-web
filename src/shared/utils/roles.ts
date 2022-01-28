import { UserRole } from "../models";

export const checkMandatoryRoles = (
  mandatoryRoles: UserRole[],
  userRoles?: UserRole[]
): boolean =>
  userRoles ? mandatoryRoles.every((role) => userRoles.includes(role)) : false;

export const checkAnyMandatoryRoles = (
  anyMandatoryRoles: UserRole[],
  userRoles?: UserRole[]
): boolean =>
  userRoles
    ? anyMandatoryRoles.some((role) => userRoles.includes(role))
    : false;
