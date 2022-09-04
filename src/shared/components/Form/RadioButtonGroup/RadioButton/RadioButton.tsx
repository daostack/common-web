import React, { useCallback, FC } from "react";
import classNames from "classnames";
import { Orientation } from "@/shared/constants";
import { useRadioButtonGroupContext } from "../context";
import { upperFirst } from "lodash";
import "./index.scss";

interface RadioButtonStyles {
  default?: string;
  active?: string;
  vertical?: string;
}

interface RadioButtonProps {
  value: string;
  isDisabled?: boolean;
  styles?: RadioButtonStyles;
  checked: boolean;
}

const RadioButton: FC<RadioButtonProps> = (props) => {
  const { value, styles, isDisabled = false, children, checked } = props;
  const { currentValue, onChange, variant } = useRadioButtonGroupContext();
  const handleClick = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <label className="custom-radio-button_label">
      <input
        className="custom-radio-button"
        type="radio"
        value={value}
        onChange={handleClick}
        checked={checked}
      />{upperFirst(value)}
    </label>
    )
};

export default RadioButton;
