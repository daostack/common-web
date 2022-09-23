import React, { useContext } from "react";
import { Orientation } from "@/shared/constants";

export interface RadioButtonGroupContextValue {
  currentValue?: unknown;
  onChange: (value: unknown) => void;
  variant: Orientation;
}

export const RadioButtonGroupContext = React.createContext<RadioButtonGroupContextValue>({
  onChange: () => {
    throw new Error("onChange is called not from the child of RadioButtonGroup");
  },
  variant: Orientation.Horizontal,
});

export const useRadioButtonGroupContext = () => useContext(RadioButtonGroupContext);
