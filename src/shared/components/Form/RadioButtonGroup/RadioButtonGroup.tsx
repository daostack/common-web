import React, { useMemo, FC } from "react";
import classNames from "classnames";

import { Orientation } from "@/shared/constants";
import { ErrorText } from "../ErrorText";
import { RadioButtonGroupContext, RadioButtonGroupContextValue } from "./context";

import "./index.scss";

interface RadioButtonGroupStyles {
  label?: string;
  error?: string;
}

export interface RadioButtonGroupProps {
  className?: string;
  label?: string;
  value?: unknown;
  onChange: (value: unknown) => void;
  variant?: Orientation;
  error?: string;
  styles?: RadioButtonGroupStyles;
}

const RadioButtonGroup: FC<RadioButtonGroupProps> = (props) => {
  const { className, label, value, onChange, error, styles, children, variant = Orientation.Horizontal } = props;

  const contextValue = useMemo<RadioButtonGroupContextValue>(() => ({
    currentValue: value,
    onChange,
    variant,
  }), [value, onChange, variant]);

  return (
    <div className={classNames("custom-radio-button-group", className)}>
      {label && (
        <label className={classNames("custom-radio-button-group__label", styles?.label)}>
          {label}
        </label>
      )}
      <div
        className={classNames("custom-radio-button-group__buttons", {
          "custom-radio-button-group__buttons--vertical": variant === Orientation.Vertical,
        })}
        role="group"
        aria-label={label}
      >
        <RadioButtonGroupContext.Provider value={contextValue}>
          {children}
        </RadioButtonGroupContext.Provider>
      </div>
      {Boolean(error) && <ErrorText className={styles?.error}>{error}</ErrorText>}
    </div>
  );
};

export default RadioButtonGroup;
