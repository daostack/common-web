import { createContext, useContext } from "react";
import { useTooltip } from "./hooks";

type Data = ReturnType<typeof useTooltip>;
type TooltipContextValue = Data | null;

export const TooltipContext = createContext<TooltipContextValue>(null);

export const useTooltipContext = (): Data => {
  const context = useContext(TooltipContext);

  if (context === null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />");
  }

  return context;
};
