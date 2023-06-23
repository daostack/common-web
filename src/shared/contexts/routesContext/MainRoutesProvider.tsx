import React, { FC, useMemo } from "react";
import { getCommonPagePath, getCommonPageAboutTabPath } from "@/shared/utils";
import { RoutesContext, RoutesContextValue } from "../routesContext";

export const MainRoutesProvider: FC = (props) => {
  const { children } = props;
  const routesContextValue = useMemo<RoutesContextValue>(
    () => ({
      getCommonPagePath,
      getCommonPageAboutTabPath,
    }),
    [],
  );

  return (
    <RoutesContext.Provider value={routesContextValue}>
      {children}
    </RoutesContext.Provider>
  );
};
