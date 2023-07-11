import React, { FC, useMemo } from "react";
import {
  getBillingPagePath,
  getCommonPagePath_v03,
  getInboxPagePath,
  getProfilePagePath,
  getProjectCreationPagePath,
} from "@/shared/utils";
import { RoutesContext, RoutesContextValue } from "../routesContext";

export const RoutesV03Provider: FC = (props) => {
  const { children } = props;
  const routesContextValue = useMemo<RoutesContextValue>(
    () => ({
      getCommonPagePath: getCommonPagePath_v03,
      getCommonPageAboutTabPath: getCommonPagePath_v03,
      getInboxPagePath,
      getProjectCreationPagePath,
      getProfilePagePath,
      getBillingPagePath,
    }),
    [],
  );

  return (
    <RoutesContext.Provider value={routesContextValue}>
      {children}
    </RoutesContext.Provider>
  );
};
