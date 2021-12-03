import React, { useContext } from "react";

export interface ToggleButtonGroupContextValue {
  currentValue?: unknown;
  onChange: (value: unknown) => void;
}

export const ToggleButtonGroupContext = React.createContext<ToggleButtonGroupContextValue>({
  onChange: () => {
    throw new Error("onChange is called not from the child of ToggleButtonGroup");
  },
});

export const useToggleButtonGroupContext = () => useContext(ToggleButtonGroupContext);
