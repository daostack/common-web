import React, { useContext } from "react";

export enum ToggleButtonGroupVariant {
  Horizontal,
  Vertical,
}

export interface ToggleButtonGroupContextValue {
  currentValue?: unknown;
  onChange: (value: unknown) => void;
  variant: ToggleButtonGroupVariant;
}

export const ToggleButtonGroupContext = React.createContext<ToggleButtonGroupContextValue>({
  onChange: () => {
    throw new Error("onChange is called not from the child of ToggleButtonGroup");
  },
  variant: ToggleButtonGroupVariant.Horizontal,
});

export const useToggleButtonGroupContext = () => useContext(ToggleButtonGroupContext);
