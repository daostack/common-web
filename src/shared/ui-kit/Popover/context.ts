import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { usePopover } from "./hooks";

type Data = ReturnType<typeof usePopover> & {
  setLabelId: Dispatch<SetStateAction<string | undefined>>;
  setDescriptionId: Dispatch<SetStateAction<string | undefined>>;
};
type PopoverContextValue = Data | null;

export const PopoverContext = createContext<PopoverContextValue>(null);

export const usePopoverContext = (): Data => {
  const context = useContext(PopoverContext);

  if (context === null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }

  return context;
};
