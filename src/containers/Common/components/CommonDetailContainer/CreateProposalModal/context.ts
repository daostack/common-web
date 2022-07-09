import React, { ReactNode, useContext } from "react";
import { GoBackHandler } from "./types";

const ERROR_TEXT =
  "Function should be used inside of CreateProposalModal component";

export interface CreateProposalContextValue {
  setTitle: (title: ReactNode) => void;
  setOnGoBack: (handler?: GoBackHandler) => void;
  setShouldShowClosePrompt: (value: boolean) => void;
  setShouldBeOnFullHeight: (value: boolean) => void;
  onError: (errorText: string) => void;
}

export const CreateProposalContext =
  React.createContext<CreateProposalContextValue>({
    setTitle: () => {
      throw new Error(ERROR_TEXT);
    },
    setOnGoBack: () => {
      throw new Error(ERROR_TEXT);
    },
    setShouldShowClosePrompt: () => {
      throw new Error(ERROR_TEXT);
    },
    setShouldBeOnFullHeight: () => {
      throw new Error(ERROR_TEXT);
    },
    onError: () => {
      throw new Error(ERROR_TEXT);
    },
  });

export const useCreateProposalContext = (): CreateProposalContextValue =>
  useContext(CreateProposalContext);
