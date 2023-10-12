import { createContext, useContext } from "react";
import {
  GetCommonPageAboutTabPath,
  GetCommonPagePath,
  GetGeneralPagePath,
  GetGeneralPageWithCommonIdPath,
} from "@/shared/utils";

interface Data {
  getCommonPagePath: GetCommonPagePath;
  getCommonPageAboutTabPath: GetCommonPageAboutTabPath;
  getInboxPagePath: GetGeneralPagePath;
  getProjectCreationPagePath: GetGeneralPageWithCommonIdPath;
  getProfilePagePath: GetGeneralPagePath;
  getBillingPagePath: GetGeneralPagePath;
  getSettingsPagePath: GetGeneralPagePath;
}

export type RoutesContextValue = Data | null;

export const RoutesContext = createContext<RoutesContextValue>(null);

export function useRoutesContext(): Data;
export function useRoutesContext(shouldThrow: false): Data | null;
export function useRoutesContext(shouldThrow = true): unknown {
  const context = useContext(RoutesContext);

  if (context === null && shouldThrow) {
    throw new Error(
      "Routes context usage is not wrapped in RoutesContext.Provider",
    );
  }

  return context;
}

export * from "./MainRoutesProvider";
export * from "./RoutesV03Provider";
export * from "./RoutesV04Provider";
