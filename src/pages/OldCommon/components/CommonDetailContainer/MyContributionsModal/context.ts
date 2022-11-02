import React, { useContext, ReactNode } from "react";
import { GoBackHandler } from "./types";

const ERROR_TEXT = "Please wrap component in MyContributionsModal";

export interface MyContributionsContextValue {
  setTitle: (title: ReactNode) => void;
  setOnGoBack: (handler?: GoBackHandler) => void;
  onError: (errorText: string) => void;
  setShouldShowClosePrompt: (value: boolean) => void;
}

export const MyContributionsContext =
  React.createContext<MyContributionsContextValue>({
    setTitle: () => {
      throw new Error(ERROR_TEXT);
    },
    setOnGoBack: () => {
      throw new Error(ERROR_TEXT);
    },
    onError: () => {
      throw new Error(ERROR_TEXT);
    },
    setShouldShowClosePrompt: () => {
      throw new Error(ERROR_TEXT);
    },
  });

export const useMyContributionsContext = (): MyContributionsContextValue =>
  useContext(MyContributionsContext);
