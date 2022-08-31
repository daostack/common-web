import React, { FC, ReactEventHandler } from "react";
import classNames from "classnames";

import RegularCheckboxIcon from "../../../icons/regularCheckbox.icon";
import SelectedCheckboxIcon from "../../../icons/selectedCheckbox.icon";
import { ErrorText } from '../ErrorText';
import "./index.scss";

interface CheckboxStyles {
  inputWrapper?: string;
  label?: string;
  error?: string;
}

export type CheckboxProps = JSX.IntrinsicElements['input'] & {
  name: string;
  label?: string;
  type?: "checkbox";
  error?: string;
  styles?: CheckboxStyles;
  onLabelClick?: ReactEventHandler;
};

const Checkbox: FC<CheckboxProps> = (props) => {
  const { className, label, error, styles, children, onLabelClick, ...restProps } = props;
  const id = restProps.id || restProps.name;

  return (
    <div className={classNames("custom-checkbox", className)}>
      <div className="custom-checkbox__wrapper">
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
        {children}
        {label && (
          <label
            onClick={onLabelClick}
            htmlFor={id}
            className={classNames("custom-checkbox__label", styles?.label)}
          >
            {label}
          </label>
        )}
      </div>
      {Boolean(error) && <ErrorText className={styles?.error}>{error}</ErrorText>}
    </div>
  );
};

export default Checkbox;
