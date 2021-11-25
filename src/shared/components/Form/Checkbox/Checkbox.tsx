import React, { FC } from "react";
import classNames from "classnames";

import RegularCheckboxIcon from "../../../icons/regularCheckbox.icon";
import SelectedCheckboxIcon from "../../../icons/selectedCheckbox.icon";
import "./index.scss";

interface CheckboxStyles {
  inputWrapper?: string;
  label?: string;
}

type CheckboxProps = JSX.IntrinsicElements['input'] & {
  name: string;
  label?: string;
  type?: "checkbox";
  styles?: CheckboxStyles;
};

const Checkbox: FC<CheckboxProps> = (props) => {
  const { className, label, styles, ...restProps } = props;
  const id = restProps.id || restProps.name;

  return (
    <div className={classNames("custom-checkbox", className)}>
      <div className={classNames("custom-checkbox__input-wrapper", styles?.inputWrapper)}>
        <input
          {...restProps}
          className="custom-checkbox__input"
          id={id}
          type="checkbox"
        />
        <RegularCheckboxIcon className="custom-checkbox__icon custom-checkbox__regular-icon" />
        <SelectedCheckboxIcon className="custom-checkbox__icon custom-checkbox__selected-icon" />
      </div>
      {label && (
        <label
          htmlFor={id}
          className={classNames("custom-checkbox__label", styles?.label)}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
