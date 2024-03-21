import React, { ReactElement } from "react";
import classnames from "classnames";
import "./index.scss";

export enum ToggleSwitchVariant {
  Blue = "Blue",
  Pink = "Pink",
}

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (toggleState: boolean) => void;
  label: string;
  variant?: ToggleSwitchVariant;
}

export function ToggleSwitch({
  isChecked,
  onChange,
  label,
  variant = ToggleSwitchVariant.Blue,
}: ToggleSwitchProps): ReactElement {
  const checkboxClassName = classnames("toggle-switch__container__checkbox", {
    "toggle-switch__container__checkbox-blue":
      variant === ToggleSwitchVariant.Blue,
    "toggle-switch__container__checkbox-pink":
      variant === ToggleSwitchVariant.Pink,
  });

  return (
    <div className="toggle-switch">
      <label className="toggle-switch__container">
        <input
          className={checkboxClassName}
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            onChange(!isChecked);
          }}
        />
        <span className={"toggle-switch__container__body"} />
      </label>
      <span className="toggle-switch__label">{label}</span>
    </div>
  );
}
