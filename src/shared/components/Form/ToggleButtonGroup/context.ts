import React, { useContext } from "react";
import { Orientation } from "@/shared/constants";

export interface ToggleButtonGroupContextValue {
  currentValue?: unknown;
  onChange: (value: unknown) => void;
  variant: Orientation;
}

export const ToggleButtonGroupContext = React.createContext<ToggleButtonGroupContextValue>({
  onChange: () => {
    throw new Error("onChange is called not from the child of ToggleButtonGroup");
  },
  variant: Orientation.Horizontal,
});

export const useToggleButtonGroupContext = () => useContext(ToggleButtonGroupContext);
