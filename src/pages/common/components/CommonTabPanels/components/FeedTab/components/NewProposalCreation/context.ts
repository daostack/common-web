import { createContext, useContext } from "react";
import { Common } from "@/shared/models";

interface Data {
  common: Common;
  parentCommons: Common[];
  subCommons: Common[];
}

export type NewProposalCreationContextValue = Data | null;

export const NewProposalCreationContext =
  createContext<NewProposalCreationContextValue>(null);

export const useNewProposalCreationContext = (): Data => {
  const context = useContext(NewProposalCreationContext);

  if (context === null) {
    throw new Error(
      "Component can be used only inside <NewProposalCreation />",
    );
  }

  return context;
};
