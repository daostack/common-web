import React, { useMemo, FC } from "react";
import classNames from "classnames";

import { ErrorText } from "../ErrorText";
import { ToggleButtonGroupContext, ToggleButtonGroupContextValue } from "./context";
import "./index.scss";

interface ToggleButtonGroupStyles {
  error?: string;
}

export interface ToggleButtonGroupProps {
  className?: string;
  label?: string;
  value?: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  styles?: ToggleButtonGroupStyles;
}

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = (props) => {
  const { className, label, value, onChange, error, styles, children } = props;

  const contextValue = useMemo<ToggleButtonGroupContextValue>(() => ({
    currentValue: value,
    onChange,
  }), [value, onChange]);

  return (
    <div className={classNames("custom-toggle-button-group", className)}>
      {label && (
        <label className="custom-toggle-button-group__label">
          {label}
        </label>
      )}
      <div
        className="custom-toggle-button-group__buttons"
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
