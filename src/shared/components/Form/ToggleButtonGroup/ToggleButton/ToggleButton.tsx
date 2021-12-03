import React, { useCallback, FC } from "react";
import classNames from "classnames";

import { useToggleButtonGroupContext } from "../context";
import "./index.scss";

interface ToggleButtonStyles {
  default?: string;
  active?: string;
}

interface ToggleButtonProps {
  value: unknown;
  styles?: ToggleButtonStyles;
}

const ToggleButton: FC<ToggleButtonProps> = (props) => {
  const { value, styles, children } = props;
  const { currentValue, onChange } = useToggleButtonGroupContext();

  const handleClick = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  const buttonClassName = classNames("custom-toggle-button", styles?.default, {
    [classNames("custom-toggle-button--active", styles?.active)]: value === currentValue,
  });

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default ToggleButton;
