import { useMemo } from "react";
import { UserRole } from "../models";
import { checkAnyMandatoryRoles } from "../utils/roles";

const useAnyMandatoryRoles = (
  anyMandatoryRoles: UserRole[],
  userRoles?: UserRole[]
): boolean =>
  useMemo(() => checkAnyMandatoryRoles(anyMandatoryRoles, userRoles), [
    anyMandatoryRoles,
    userRoles,
  ]);

export default useAnyMandatoryRoles;
