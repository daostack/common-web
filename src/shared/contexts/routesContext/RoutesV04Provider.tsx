import React, { FC, useMemo } from "react";
import {
  getCommonPagePath_v04,
  getCommonPageAboutTabPath_v04,
  getInboxPagePath_v04,
} from "@/shared/utils";
import { RoutesContext, RoutesContextValue } from "../routesContext";

export const RoutesV04Provider: FC = (props) => {
  const { children } = props;
  const routesContextValue = useMemo<RoutesContextValue>(
    () => ({
      getCommonPagePath: getCommonPagePath_v04,
      getCommonPageAboutTabPath: getCommonPageAboutTabPath_v04,
      getInboxPagePath: getInboxPagePath_v04,
    }),
    [],
  );

  return (
    <RoutesContext.Provider value={routesContextValue}>
      {children}
    </RoutesContext.Provider>
  );
};
