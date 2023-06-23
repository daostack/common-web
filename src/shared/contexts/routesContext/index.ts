import { createContext, useContext } from "react";
import { GetCommonPageAboutTabPath, GetCommonPagePath } from "@/shared/utils";

interface Data {
  getCommonPagePath: GetCommonPagePath;
  getCommonPageAboutTabPath: GetCommonPageAboutTabPath;
}

export type RoutesContextValue = Data | null;

export const RoutesContext = createContext<RoutesContextValue>(null);

export const useRoutesContext = (): Data => {
  const context = useContext(RoutesContext);

  if (context === null) {
    throw new Error(
      "Routes context usage is not wrapped in RoutesContext.Provider",
    );
  }

  return context;
};

export * from "./MainRoutesProvider";
export * from "./RoutesV03Provider";
export * from "./RoutesV04Provider";
