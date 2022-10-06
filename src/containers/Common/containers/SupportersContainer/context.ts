import React, { useContext } from "react";
import { SupportersData, SupportersDataTranslation } from "@/shared/models";

export interface SupportersDataContextValue {
  supportersData: SupportersData | null;
  currentTranslation: SupportersDataTranslation | null;
}

export const SupportersDataContext =
  React.createContext<SupportersDataContextValue>({
    supportersData: null,
    currentTranslation: null,
  });

export const useSupportersDataContext = () => useContext(SupportersDataContext);
