import React, { useCallback, FC } from "react";
import classNames from "classnames";
import { upperFirst } from "lodash";
import { useRadioButtonGroupContext } from "../context";
import "./index.scss";

interface RadioButtonStyles {
  default?: string;
  active?: string;
  vertical?: string;
  button?: string;
}

interface RadioButtonProps {
  value: string;
  isDisabled?: boolean;
  styles?: RadioButtonStyles;
  checked: boolean;
}

export const RadioButton: FC<RadioButtonProps> = (props) => {
  const { value, styles, isDisabled = false, children, checked } = props;
  const { currentValue, onChange, variant } = useRadioButtonGroupContext();
  const handleClick = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <label className="custom-radio-button_label">
      <input
        className={classNames("custom-radio-button", styles?.button)}
        type="radio"
        value={value}
        onChange={handleClick}
        checked={checked}
        disabled={isDisabled}
      />
      {upperFirst(value)}
    </label>
  );
};
