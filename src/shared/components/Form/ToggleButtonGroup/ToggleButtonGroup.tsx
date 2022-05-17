import React, { useMemo, FC } from "react";
import classNames from "classnames";

import { Orientation } from "@/shared/constants";
import { ErrorText } from "../ErrorText";
import { ToggleButtonGroupContext, ToggleButtonGroupContextValue } from "./context";

import "./index.scss";

interface ToggleButtonGroupStyles {
  label?: string;
  error?: string;
}

export interface ToggleButtonGroupProps {
  className?: string;
  label?: string;
  value?: unknown;
  onChange: (value: unknown) => void;
  variant?: Orientation;
  error?: string;
  styles?: ToggleButtonGroupStyles;
}

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = (props) => {
  const { className, label, value, onChange, error, styles, children, variant = Orientation.Horizontal } = props;

  const contextValue = useMemo<ToggleButtonGroupContextValue>(() => ({
    currentValue: value,
    onChange,
    variant,
  }), [value, onChange, variant]);

  return (
    <div className={classNames("custom-toggle-button-group", className)}>
      {label && (
        <label className={classNames("custom-toggle-button-group__label", styles?.label)}>
          {label}
        </label>
      )}
      <div
        className={classNames("custom-toggle-button-group__buttons", {
          "custom-toggle-button-group__buttons--vertical": variant === Orientation.Vertical,
        })}
        role="group"
        aria-label={label}
      >
        <ToggleButtonGroupContext.Provider value={contextValue}>
          {children}
        </ToggleButtonGroupContext.Provider>
      </div>
      {Boolean(error) && <ErrorText className={styles?.error}>{error}</ErrorText>}
    </div>
  );
};

export default ToggleButtonGroup;
