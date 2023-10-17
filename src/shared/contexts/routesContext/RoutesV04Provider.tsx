import React, { FC, useMemo } from "react";
import {
  getCommonPagePath_v04,
  getCommonPageAboutTabPath_v04,
  getInboxPagePath_v04,
  getProfilePagePath_v04,
  getBillingPagePath_v04,
  getProjectCreationPagePath_v04,
  getSettingsPagePath_v04,
} from "@/shared/utils";
import { RoutesContext, RoutesContextValue } from "../routesContext";

export const RoutesV04Provider: FC = (props) => {
  const { children } = props;
  const routesContextValue = useMemo<RoutesContextValue>(
    () => ({
      getCommonPagePath: getCommonPagePath_v04,
      getCommonPageAboutTabPath: getCommonPageAboutTabPath_v04,
      getInboxPagePath: getInboxPagePath_v04,
      getProjectCreationPagePath: getProjectCreationPagePath_v04,
      getProfilePagePath: getProfilePagePath_v04,
      getBillingPagePath: getBillingPagePath_v04,
      getSettingsPagePath: getSettingsPagePath_v04,
    }),
    [],
  );

  return (
    <RoutesContext.Provider value={routesContextValue}>
      {children}
    </RoutesContext.Provider>
  );
};
