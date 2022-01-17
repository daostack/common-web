import React, { useState, FC } from "react";
import classNames from "classnames";

import { ErrorText } from "../ErrorText";
import "./index.scss";

interface InputStyles {
  label?: string;
  description?: string;
  labelWrapper?: string;
  input?: {
    default?: string;
  };
  error?: string;
}

type InputProps = JSX.IntrinsicElements['input'] & { isTextarea?: false };
type TextareaProps = JSX.IntrinsicElements['textarea'] & { isTextarea: true };
type FilterExtraPropsFunction = {
  (props: InputProps): JSX.IntrinsicElements['input'];
  (props: TextareaProps): JSX.IntrinsicElements['textarea'];
};
export type FullInputProps = (InputProps | TextareaProps) & {
  name: string;
  className?: string;
  label?: string;
  description?: string;
  hint?: string;
  maxLength?: number;
  shouldDisplayCount?: boolean;
  error?: string;
  styles?: InputStyles;
};

const filterExtraProps: FilterExtraPropsFunction = <T extends (InputProps | TextareaProps)>(props: T) => {
  const { isTextarea, ...restProps } = props;

  return restProps;
};

const Input: FC<FullInputProps> = (props) => {
  const { className, label, description, hint, maxLength, shouldDisplayCount, error, styles, ...restProps } = props;
  const [inputLengthRef, setInputLengthRef] = useState<HTMLSpanElement | null>(null);
  const id = restProps.id || restProps.name;
  const shouldDisplayCountToUse = shouldDisplayCount ?? Boolean(maxLength && maxLength > 0);
  const inputStyles = shouldDisplayCountToUse && inputLengthRef
    ? { paddingRight: inputLengthRef.clientWidth + 14 }
    : undefined;
  const labelWrapperClassName = classNames("custom-input__label-wrapper", {
    "custom-input__label-wrapper--with-description": description,
  });
  const inputClassName = classNames("custom-input__input", styles?.input?.default, {
    "custom-input__input--error": error,
  });
  const generalInputProps = {
    id,
    className: inputClassName,
    style: inputStyles,
  };

  return (
    <div className={classNames("custom-input", className)}>
      {(label || hint) && (
        <div className={classNames("custom-input__label-wrapper", styles?.labelWrapper)}>
          {label && (
            <label
              htmlFor={id}
              className={classNames("custom-input__label", styles?.label)}
            >
              {label}
            </label>
          )}
          {hint && <span className="custom-input__hint">{hint}</span>}
        </div>
      )}
      {description && (
        <p className={classNames("custom-input__description", styles?.description)}>
          {description}
        </p>
      )}
      <div className="custom-input__input-wrapper">
        {!restProps.isTextarea && (
          <input
            {...filterExtraProps(restProps)}
            {...generalInputProps}
          />
        )}
        {restProps.isTextarea && (
          <textarea
            {...filterExtraProps(restProps)}
            {...generalInputProps}
          />
        )}
        {shouldDisplayCountToUse && (
          <span
            className="custom-input__input-length"
            ref={setInputLengthRef}
          >
            {typeof restProps.value === 'string' ? restProps.value.length : 0}/{maxLength}
          </span>
        )}
      </div>
      {Boolean(error) && <ErrorText className={styles?.error}>{error}</ErrorText>}
    </div>
  );
};

export default Input;
