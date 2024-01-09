import { useCallback, useState } from "react";

export interface ToggleState {
  isToggledOn: boolean;
  toggle: () => void;
  setToggleOn: () => void;
  setToggleOff: () => void;
}

export const useToggle = (
  initialValue: boolean | (() => boolean) = false,
): ToggleState => {
  const [isToggledOn, setToggle] = useState(initialValue);
  const toggle = useCallback(() => setToggle((isOn) => !isOn), []);
  const setToggleOn = useCallback(() => setToggle(true), []);
  const setToggleOff = useCallback(() => setToggle(false), []);

  return {
    isToggledOn,
    toggle,
    setToggleOn,
    setToggleOff,
  };
};
